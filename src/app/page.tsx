'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { trpc } from '@/utils/trpc';

// Import tldraw dynamically to avoid SSR issues
const Tldraw = dynamic(
  () => import('tldraw').then((mod) => {
    const { Tldraw } = mod;
    return Tldraw;
  }),
  { ssr: false }
);

interface PriceUpdate {
  originalPrice: string;
  newPrice: string;
  coordinates: {
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
  }, [uploadImage]);

  const handleSaveChanges = useCallback(async () => {
    if (!menuImageId) return;

    try {
      setError(null);
      const result = await updatePrices.mutateAsync({
        menuImageId,
        priceUpdates,
      });
      console.log('Prices updated:', result);
    } catch (error) {
      console.error('Error updating prices:', error);
      setError('Failed to update prices. Please try again.');
    }
  }, [menuImageId, priceUpdates, updatePrices]);

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
              <Tldraw />
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
              <h2 className="text-lg font-semibold mb-4">Price Updates</h2>
              <div className="space-y-2">
                {priceUpdates.map((update, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-mono">{update.originalPrice}</span>
                    <span className="text-gray-500">→</span>
                    <span className="font-mono">{update.newPrice}</span>
                  </div>
                ))}
              </div>
              {priceUpdates.length > 0 && (
                <button
                  onClick={handleSaveChanges}
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
