'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { trpc } from '@/utils/trpc';
import { Editor, Tldraw as TldrawComponent, TLShape, TLShapeId } from 'tldraw';

// Import tldraw dynamically to avoid SSR issues
const Tldraw = dynamic(
  () => import('tldraw').then((mod) => mod.Tldraw),
  { ssr: false }
);

interface PriceUpdate {
  id: TLShapeId;
  originalPrice: string;
  newPrice: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function Home() {
  const [menuImageId, setMenuImageId] = useState<number | null>(null);
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  const uploadImage = trpc.menu.uploadImage.useMutation({
    onError: () => {
      setError('Failed to upload image. Please try again.');
    },
  });

  const updatePrices = trpc.menu.updatePrices.useMutation({
    onError: () => {
      setError('Failed to update prices. Please try again.');
    },
  });

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      console.log('Starting image upload process with file:', file.name);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      console.log('Sending file to /api/upload endpoint');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Upload response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Upload response data:', data);
      const { url } = data;
      console.log('Received URL from upload:', url);

      if (!url) {
        console.error('URL is undefined before uploadImage mutation');
        setError('Failed to get image URL');
        return;
      }

      // Fetch the image and create a File object
      const imageResponse = await fetch(window.location.origin + url);
      const imageBlob = await imageResponse.blob();
      const imageFile = new File([imageBlob], file.name, { type: file.type });

      // Add the image to tldraw
      if (editor) {
        try {
          // Create an image element to get dimensions
          const img = new Image();
          img.src = url;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          // Calculate dimensions
          const { width, height } = img;
          const aspectRatio = width / height;
          const maxWidth = 800;
          const maxHeight = 600;
          let w = width;
          let h = height;

          if (width > maxWidth) {
            w = maxWidth;
            h = w / aspectRatio;
          }
          if (h > maxHeight) {
            h = maxHeight;
            w = h * aspectRatio;
          }

          // Insert the image using the editor's API
          await editor.putExternalContent({
            type: 'files',
            files: [imageFile],
            ignoreParent: false,
          });

          // Center the image in the viewport
          editor.zoomToFit();
        } catch (error) {
          console.error('Error adding image to tldraw:', error);
          setError('Failed to display image in editor');
        }
      }

      console.log('Attempting uploadImage mutation with URL:', url);
      try {
        console.log('Calling uploadImage.mutateAsync with:', { imageUrl: url });
        const result = await uploadImage.mutateAsync({
          imageUrl: url
        });
        console.log('Image saved successfully:', result);
        setMenuImageId(result.id);
      } catch (error) {
        console.error('Error in uploadImage mutation:', error);
        setError('Failed to save image to database');
      }
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      setError('Failed to upload image. Please try again.');
    }
  }, [uploadImage, editor]);

  const handleMount = useCallback((editor: Editor) => {
    setEditor(editor);

    // Set up a store listener for shape changes
    const unsubscribe = editor.store.listen(() => {
      const allShapes = editor.getCurrentPageShapes();
      
      // Find the most recently created rectangle
      const newShape = allShapes
        .filter(shape => 
          shape.type === 'geo' && 
          shape.props && 
          typeof shape.props === 'object' &&
          'geo' in shape.props &&
          shape.props.geo === 'rectangle'
        )
        .pop(); // Get the last rectangle created

      // Only add if this shape isn't already in our price updates
      if (newShape && !priceUpdates.some(update => update.id === newShape.id)) {
        const newUpdate = {
          id: newShape.id,
          originalPrice: '',
          newPrice: '',
          bounds: {
            x: newShape.x,
            y: newShape.y,
            width: newShape.props && typeof newShape.props === 'object' && 'size' in newShape.props ? 
              (Array.isArray(newShape.props.size) ? newShape.props.size[0] : 100) : 100,
            height: newShape.props && typeof newShape.props === 'object' && 'size' in newShape.props ? 
              (Array.isArray(newShape.props.size) ? newShape.props.size[1] : 100) : 100,
          }
        };

        // Replace all existing updates with just this one
        setPriceUpdates([newUpdate]);

        // Select the shape to make it clear which one we're working with
        editor.select(newShape.id);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [priceUpdates]);

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Menu Price Updater</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex gap-4">
          <div className="flex-1 h-[800px] bg-white rounded-lg shadow-lg overflow-hidden relative">
            <div className="absolute inset-0">
              <Tldraw 
                onMount={handleMount}
              />
            </div>
          </div>

          <div className="w-80 space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Upload Menu</h2>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="p-4 bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Price Update</h2>
              <div className="space-y-4">
                {priceUpdates.map((update) => (
                  <div key={update.id.toString()} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Current Price"
                        value={update.originalPrice}
                        onChange={(e) => {
                          setPriceUpdates(prev =>
                            prev.map(u =>
                              u.id === update.id
                                ? { ...u, originalPrice: e.target.value }
                                : u
                            )
                          );
                        }}
                        className="flex-1 p-2 border rounded"
                      />
                      <span className="flex items-center">→</span>
                      <input
                        type="text"
                        placeholder="New Price"
                        value={update.newPrice}
                        onChange={(e) => {
                          setPriceUpdates(prev =>
                            prev.map(u =>
                              u.id === update.id
                                ? { ...u, newPrice: e.target.value }
                                : u
                            )
                          );
                        }}
                        className="flex-1 p-2 border rounded"
                      />
                    </div>
                    <button
                      onClick={() => {
                        // Remove the price update and the corresponding shape
                        setPriceUpdates([]);
                        if (editor && update.id) {
                          editor.deleteShape(update.id);
                        }
                      }}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              {priceUpdates.length > 0 && (
                <button
                  onClick={() => {
                    if (menuImageId) {
                      updatePrices.mutate({
                        menuImageId,
                        priceUpdates: priceUpdates.map(({ originalPrice, newPrice, bounds }) => ({
                          originalPrice,
                          newPrice,
                          coordinates: bounds
                        }))
                      });
                    }
                  }}
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
