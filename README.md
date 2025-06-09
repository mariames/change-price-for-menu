# MenuByAI - Intelligent Menu Price Detection

MenuByAI is a web application that uses AI to automatically detect and extract prices from menu images. Built with Next.js, tldraw, and Tesseract.js, it provides an interactive interface for selecting and processing menu prices.

## Features

- **Interactive Canvas**: Using tldraw for image manipulation and price selection
- **Real-time OCR**: Optical Character Recognition powered by Tesseract.js
- **Visual Feedback**: Color-coded rectangles indicate successful/failed price detection
- **Price List**: Automatically compiled list of detected prices
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## How It Works

1. **Image Upload**: 
   - Press 'I' to activate the image tool
   - Click anywhere on the canvas to upload your menu image
   - The image will be centered automatically

2. **Price Selection**:
   - Press 'R' to activate the rectangle tool
   - Draw rectangles around prices you want to detect
   - The system will automatically process each selection

3. **Visual Feedback**:
   - Green rectangle: Price successfully detected
   - Red rectangle: No price found or processing error
   - Preview window shows the captured area during processing

## Technical Implementation

### Version History

#### Version 1.0
- Initial setup with Next.js and tldraw
- Basic image upload functionality
- Rectangle drawing implementation

#### Version 1.1
- Added Tesseract.js integration
- Implemented basic OCR functionality
- Added price detection logic

#### Version 1.2
- Improved canvas detection methods
- Added SVG export functionality
- Enhanced error handling and debugging
- Improved user feedback system

### Key Components

1. **Canvas Management**:
   - Uses tldraw for vector-based drawing
   - Custom shape handling for rectangles
   - Real-time shape change detection

2. **OCR Processing**:
   - Tesseract.js worker initialization
   - Image preprocessing for better recognition
   - Price pattern matching

3. **State Management**:
   - React hooks for component state
   - Debounced processing to prevent overlapping operations
   - Persistent worker reference

### Technologies Used

- **Frontend**: Next.js, React
- **Drawing**: tldraw
- **OCR**: Tesseract.js
- **Styling**: Tailwind CSS

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd menu-price-ai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Current Status

The application is in active development with the following features working:
- ✅ Image upload and display
- ✅ Rectangle drawing and selection
- ✅ Basic OCR processing
- ✅ Price detection
- ✅ Visual feedback system

### Known Issues

1. SVG Export:
   - Currently investigating issues with SVG export functionality
   - Working on alternative capture methods

2. Processing Speed:
   - OCR processing can take a few seconds
   - Implementing optimizations for faster processing

## Future Improvements

1. **Performance**:
   - Optimize image processing
   - Implement caching for processed areas
   - Reduce processing time

2. **Features**:
   - Batch processing of multiple prices
   - Export functionality for detected prices
   - Custom price format detection

3. **UI/UX**:
   - More detailed processing feedback
   - Undo/redo functionality
   - Price editing capabilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
