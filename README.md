# Building Planner

A web application that allows users to select, draw, and annotate building plans. This application provides a simple and minimal interface with drawing tools for creating building plans and adding annotations for dimensions.

## Features

- **Drawing Tools**: Create lines, rectangles, circles, and triangles
- **Measurement Tool**: Add dimension annotations with automatic measurements
- **Selection Tool**: Move, resize, and transform drawn shapes
- **View Tool**: Show or hide annotations
- **Customization**: Change colors and stroke width
- **Storage**: Save and load drawings using local storage
- **Grid Background**: Precise drawing with grid alignment
- **Clear Canvas**: Reset the drawing area

## Technologies Used

- **React.js** - Frontend framework
- **Konva.js** - Canvas drawing library
- **React-Konva** - React integration for Konva
- **LocalStorage API** - For saving and loading drawings

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Running the Application

```
npm start
```
or
```
yarn start
```

The application will be available at http://localhost:3000

## Usage

1. Select a drawing tool from the toolbar (Line, Rectangle, Circle, Triangle, Measure, or Select)
2. Click and drag on the canvas to draw
3. Use the Measure tool to create dimension annotations
4. Use the Select tool to move, resize, or transform shapes
5. Toggle annotation visibility with the Show/Hide Annotations button
6. Customize the color and stroke width using the toolbar controls
7. Save your drawing using the Save button
8. Load a previously saved drawing using the Load button
9. Clear the canvas using the Clear All button

## Project Structure

```
├── public/             # Public assets
├── src/                # Source files
│   ├── components/     # React components
│   │   └── Toolbar.js  # Drawing toolbar component
│   ├── App.js          # Main application component
│   ├── App.css         # Application styles
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
└── package.json        # Project dependencies
```

## Database Model

The application uses a simple database model to store drawing details:

```javascript
const DrawingDatabase = {
  saveDrawing: (drawingData) => {
    localStorage.setItem('buildingPlannerDrawing', JSON.stringify(drawingData));
    return true;
  },
  loadDrawing: () => {
    const data = localStorage.getItem('buildingPlannerDrawing');
    return data ? JSON.parse(data) : null;
  }
};
```

This model uses the browser's localStorage API to persist drawing data. The data structure includes:

- **shapes**: Array of all drawn shapes with their properties (type, position, size, color, etc.)
- **annotations**: Array of all measurement annotations with their properties

For a production application, this could be replaced with a server-side database like MongoDB or PostgreSQL.