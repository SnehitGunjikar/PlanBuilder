import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Text, Rect } from 'react-konva';
import Toolbar from './components/Toolbar';
import './App.css';

const App = () => {
  // State for managing the current tool
  const [tool, setTool] = useState('line');
  const [lines, setLines] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const stageRef = useRef(null);

  // Handle mouse down event
  const handleMouseDown = (e) => {
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
      };
      setCurrentLine(newLine);
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
      };
      setCurrentLine(newRect);
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
    
    if (tool === 'line' && currentLine) {
      const updatedLine = {
        ...currentLine,
        points: [currentLine.points[0], currentLine.points[1], pos.x, pos.y],
      };
      setCurrentLine(updatedLine);
    } else if (tool === 'rect' && currentLine) {
      const updatedRect = {
        ...currentLine,
        width: pos.x - currentLine.x,
        height: pos.y - currentLine.y,
      };
      setCurrentLine(updatedRect);
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
    
    if (currentLine) {
      setLines([...lines, currentLine]);
      setCurrentLine(null);
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
    setLines([]);
    setAnnotations([]);
  };

  // Render the current line being drawn
  const renderCurrentLine = () => {
    if (!currentLine) return null;
    
    if (currentLine.tool === 'line') {
      return (
        <Line
          points={currentLine.points}
          stroke={currentLine.color}
          strokeWidth={currentLine.strokeWidth}
          tension={0}
          lineCap="round"
        />
      );
    } else if (currentLine.tool === 'rect') {
      return (
        <Rect
          x={currentLine.x}
          y={currentLine.y}
          width={currentLine.width}
          height={currentLine.height}
          stroke={currentLine.color}
          strokeWidth={currentLine.strokeWidth}
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
      />
      <div className="drawing-area">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 60}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
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
            
            {/* Render all completed lines */}
            {lines.map((line) => {
              if (line.tool === 'line') {
                return (
                  <Line
                    key={line.id}
                    points={line.points}
                    stroke={line.color}
                    strokeWidth={line.strokeWidth}
                    tension={0}
                    lineCap="round"
                  />
                );
              } else if (line.tool === 'rect') {
                return (
                  <Rect
                    key={line.id}
                    x={line.x}
                    y={line.y}
                    width={line.width}
                    height={line.height}
                    stroke={line.color}
                    strokeWidth={line.strokeWidth}
                    fill="transparent"
                  />
                );
              }
              return null;
            })}
            
            {/* Render all annotations */}
            {annotations.map((annotation) => (
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
            
            {/* Render the current line being drawn */}
            {renderCurrentLine()}
            {renderCurrentAnnotation()}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default App;