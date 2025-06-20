import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Text, Rect, Circle, RegularPolygon, Transformer } from 'react-konva';
import Toolbar from './components/Toolbar';
import './App.css';

// Database model for storing drawing details
// This is a simple in-memory model, but could be replaced with a real database
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

const App = () => {
  // State for managing the current tool
  const [tool, setTool] = useState('line');
  const [shapes, setShapes] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  // Handle selection of shapes
  React.useEffect(() => {
    if (selectedId && transformerRef.current) {
      // Find the selected shape node
      const selectedNode = stageRef.current.findOne('#' + selectedId);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  // Handle mouse down event
  const handleMouseDown = (e) => {
    // Deselect when clicking on the stage background
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
    
    if (tool === 'select') return;
    
    const pos = e.target.getStage().getPointerPosition();
    setIsDrawing(true);
    
    if (tool === 'line') {
      const newLine = {
        id: Date.now(),
        tool,
        points: [pos.x, pos.y, pos.x, pos.y],
        color,
        strokeWidth,
        draggable: true,
      };
      setCurrentShape(newLine);
    } else if (tool === 'rect') {
      const newRect = {
        id: Date.now(),
        tool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color,
        strokeWidth,
        draggable: true,
      };
      setCurrentShape(newRect);
    } else if (tool === 'circle') {
      const newCircle = {
        id: Date.now(),
        tool,
        x: pos.x,
        y: pos.y,
        radius: 0,
        color,
        strokeWidth,
        draggable: true,
      };
      setCurrentShape(newCircle);
    } else if (tool === 'triangle') {
      const newTriangle = {
        id: Date.now(),
        tool,
        x: pos.x,
        y: pos.y,
        sides: 3,
        radius: 0,
        color,
        strokeWidth,
        draggable: true,
      };
      setCurrentShape(newTriangle);
    } else if (tool === 'annotate') {
      // Start creating an annotation
      const newAnnotation = {
        id: Date.now(),
        tool,
        x: pos.x,
        y: pos.y,
        text: '',
        width: 0,
        points: [pos.x, pos.y, pos.x, pos.y],
        color,
        strokeWidth,
      };
      setCurrentAnnotation(newAnnotation);
    }
  };

  // Handle mouse move event
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const pos = e.target.getStage().getPointerPosition();
    
    if (tool === 'line' && currentShape) {
      const updatedLine = {
        ...currentShape,
        points: [currentShape.points[0], currentShape.points[1], pos.x, pos.y],
      };
      setCurrentShape(updatedLine);
    } else if (tool === 'rect' && currentShape) {
      const updatedRect = {
        ...currentShape,
        width: pos.x - currentShape.x,
        height: pos.y - currentShape.y,
      };
      setCurrentShape(updatedRect);
    } else if (tool === 'circle' && currentShape) {
      const dx = pos.x - currentShape.x;
      const dy = pos.y - currentShape.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      const updatedCircle = {
        ...currentShape,
        radius: radius,
      };
      setCurrentShape(updatedCircle);
    } else if (tool === 'triangle' && currentShape) {
      const dx = pos.x - currentShape.x;
      const dy = pos.y - currentShape.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      const updatedTriangle = {
        ...currentShape,
        radius: radius,
      };
      setCurrentShape(updatedTriangle);
    } else if (tool === 'annotate' && currentAnnotation) {
      const updatedAnnotation = {
        ...currentAnnotation,
        points: [currentAnnotation.points[0], currentAnnotation.points[1], pos.x, pos.y],
        width: Math.abs(pos.x - currentAnnotation.x),
      };
      setCurrentAnnotation(updatedAnnotation);
    }
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (currentShape) {
      setShapes([...shapes, currentShape]);
      setCurrentShape(null);
    }
    
    if (currentAnnotation) {
      // Calculate the length of the line
      const x1 = currentAnnotation.points[0];
      const y1 = currentAnnotation.points[1];
      const x2 = currentAnnotation.points[2];
      const y2 = currentAnnotation.points[3];
      
      // Calculate the length using the Pythagorean theorem
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(2);
      
      const finalAnnotation = {
        ...currentAnnotation,
        text: `${length} units`,
      };
      
      setAnnotations([...annotations, finalAnnotation]);
      setCurrentAnnotation(null);
    }
  };

  // Clear the canvas
  const handleClear = () => {
    setShapes([]);
    setAnnotations([]);
    setSelectedId(null);
  };

  // Save the current drawing
  const handleSave = () => {
    const drawingData = {
      shapes,
      annotations,
    };
    DrawingDatabase.saveDrawing(drawingData);
    alert('Drawing saved successfully!');
  };

  // Load a saved drawing
  const handleLoad = () => {
    const drawingData = DrawingDatabase.loadDrawing();
    if (drawingData) {
      setShapes(drawingData.shapes || []);
      setAnnotations(drawingData.annotations || []);
      alert('Drawing loaded successfully!');
    } else {
      alert('No saved drawing found.');
    }
  };

  // Toggle annotations visibility
  const toggleAnnotations = () => {
    setShowAnnotations(!showAnnotations);
  };

  // Handle shape selection
  const handleShapeClick = (e) => {
    if (tool !== 'select') return;
    
    // Prevent deselection when clicking on a transformer
    if (e.target.getParent().className === 'Transformer') {
      return;
    }
    
    const clickedOnTransformer = e.target.getParent().className === 'Transformer';
    const clickedOnShape = e.target.id() !== '';
    
    if (clickedOnShape && !clickedOnTransformer) {
      setSelectedId(e.target.id());
    } else {
      setSelectedId(null);
    }
  };

  // Handle shape transform
  const handleTransformEnd = (e) => {
    // Update the shape with new properties after transformation
    const node = e.target;
    const shapeId = node.id();
    
    const updatedShapes = shapes.map(shape => {
      if (shape.id.toString() === shapeId) {
        // Get the new properties from the node
        return {
          ...shape,
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
          rotation: node.rotation(),
          // Reset scale to avoid double scaling
          scaleX: 1,
          scaleY: 1
        };
      }
      return shape;
    });
    
    setShapes(updatedShapes);
  };

  // Handle shape drag end
  const handleDragEnd = (e) => {
    const id = e.target.id();
    const updatedShapes = shapes.map(shape => {
      if (shape.id.toString() === id) {
        return {
          ...shape,
          x: e.target.x(),
          y: e.target.y()
        };
      }
      return shape;
    });
    setShapes(updatedShapes);
  };

  // Render the current shape being drawn
  const renderCurrentShape = () => {
    if (!currentShape) return null;
    
    if (currentShape.tool === 'line') {
      return (
        <Line
          points={currentShape.points}
          stroke={currentShape.color}
          strokeWidth={currentShape.strokeWidth}
          tension={0}
          lineCap="round"
        />
      );
    } else if (currentShape.tool === 'rect') {
      return (
        <Rect
          x={currentShape.x}
          y={currentShape.y}
          width={currentShape.width}
          height={currentShape.height}
          stroke={currentShape.color}
          strokeWidth={currentShape.strokeWidth}
          fill="transparent"
        />
      );
    } else if (currentShape.tool === 'circle') {
      return (
        <Circle
          x={currentShape.x}
          y={currentShape.y}
          radius={currentShape.radius}
          stroke={currentShape.color}
          strokeWidth={currentShape.strokeWidth}
          fill="transparent"
        />
      );
    } else if (currentShape.tool === 'triangle') {
      return (
        <RegularPolygon
          x={currentShape.x}
          y={currentShape.y}
          sides={3}
          radius={currentShape.radius}
          stroke={currentShape.color}
          strokeWidth={currentShape.strokeWidth}
          fill="transparent"
        />
      );
    }
    return null;
  };

  // Render the current annotation being created
  const renderCurrentAnnotation = () => {
    if (!currentAnnotation) return null;
    
    return (
      <>
        <Line
          points={currentAnnotation.points}
          stroke={currentAnnotation.color}
          strokeWidth={currentAnnotation.strokeWidth}
          dash={[5, 5]}
          lineCap="round"
        />
      </>
    );
  };

  return (
    <div className="app-container">
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onClear={handleClear}
        onSave={handleSave}
        onLoad={handleLoad}
        showAnnotations={showAnnotations}
        onToggleAnnotations={toggleAnnotations}
      />
      <div className="drawing-area">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 60}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleShapeClick}
          ref={stageRef}
        >
          <Layer>
            {/* Grid background */}
            {Array.from({ length: 50 }).map((_, i) => (
              <Line
                key={`h-${i}`}
                points={[0, i * 20, window.innerWidth, i * 20]}
                stroke="#ddd"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: 50 }).map((_, i) => (
              <Line
                key={`v-${i}`}
                points={[i * 20, 0, i * 20, window.innerHeight]}
                stroke="#ddd"
                strokeWidth={1}
              />
            ))}
            
            {/* Render all completed shapes */}
            {shapes.map((shape) => {
              if (shape.tool === 'line') {
                return (
                  <Line
                    key={shape.id}
                    id={shape.id.toString()}
                    points={shape.points}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    tension={0}
                    lineCap="round"
                    draggable={tool === 'select'}
                    onDragEnd={handleDragEnd}
                  />
                );
              } else if (shape.tool === 'rect') {
                return (
                  <Rect
                    key={shape.id}
                    id={shape.id.toString()}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    fill="transparent"
                    draggable={tool === 'select'}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              } else if (shape.tool === 'circle') {
                return (
                  <Circle
                    key={shape.id}
                    id={shape.id.toString()}
                    x={shape.x}
                    y={shape.y}
                    radius={shape.radius}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    fill="transparent"
                    draggable={tool === 'select'}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              } else if (shape.tool === 'triangle') {
                return (
                  <RegularPolygon
                    key={shape.id}
                    id={shape.id.toString()}
                    x={shape.x}
                    y={shape.y}
                    sides={3}
                    radius={shape.radius}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    fill="transparent"
                    draggable={tool === 'select'}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              }
              return null;
            })}
            
            {/* Render all annotations if showAnnotations is true */}
            {showAnnotations && annotations.map((annotation) => (
              <React.Fragment key={annotation.id}>
                <Line
                  points={annotation.points}
                  stroke={annotation.color}
                  strokeWidth={annotation.strokeWidth}
                  dash={[5, 5]}
                  lineCap="round"
                />
                <Text
                  text={annotation.text}
                  x={(annotation.points[0] + annotation.points[2]) / 2 - 20}
                  y={(annotation.points[1] + annotation.points[3]) / 2 - 10}
                  fontSize={14}
                  fill={annotation.color}
                  padding={2}
                  background="white"
                />
              </React.Fragment>
            ))}
            
            {/* Render the current shape being drawn */}
            {renderCurrentShape()}
            {renderCurrentAnnotation()}
            
            {/* Transformer for selected shapes */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit minimum size
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default App;