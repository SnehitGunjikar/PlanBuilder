import React from 'react';

const Toolbar = ({ tool, setTool, color, setColor, strokeWidth, setStrokeWidth, onClear }) => {
  return (
    <div className="toolbar-container">
      <div className="tool-group">
        <button
          className={`tool-button ${tool === 'line' ? 'active' : ''}`}
          onClick={() => setTool('line')}
          title="Line Tool"
        >
          Line
        </button>
        <button
          className={`tool-button ${tool === 'rect' ? 'active' : ''}`}
          onClick={() => setTool('rect')}
          title="Rectangle Tool"
        >
          Rectangle
        </button>
        <button
          className={`tool-button ${tool === 'annotate' ? 'active' : ''}`}
          onClick={() => setTool('annotate')}
          title="Annotation Tool"
        >
          Measure
        </button>
        <button
          className={`tool-button ${tool === 'select' ? 'active' : ''}`}
          onClick={() => setTool('select')}
          title="Select Tool"
        >
          Select
        </button>
      </div>
      
      <div className="tool-group">
        <div className="stroke-width-control">
          <label htmlFor="stroke-width">Width:</label>
          <input
            id="stroke-width"
            type="number"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
          />
        </div>
        <div>
          <label htmlFor="color-picker">Color:</label>
          <input
            id="color-picker"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-picker"
          />
        </div>
      </div>
      
      <div className="tool-group">
        <button
          className="tool-button"
          onClick={onClear}
          title="Clear Canvas"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Toolbar;