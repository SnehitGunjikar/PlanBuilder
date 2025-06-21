import React from 'react';

const Toolbar = ({ 
  tool, 
  setTool, 
  color, 
  setColor, 
  strokeWidth, 
  setStrokeWidth, 
  onClear, 
  onSave, 
  onLoad, 
  showAnnotations, 
  onToggleAnnotations 
}) => {
  return (
    <div className="toolbar-container">
      <div className="tool-group">
        <button
          className={`tool-button ${tool === 'line' ? 'active' : ''}`}
          onClick={() => setTool('line')}
          title="Line Tool"
        >
          <span className="tool-icon">━</span>
          <span className="tool-label">Line</span>
        </button>
        <button
          className={`tool-button ${tool === 'rect' ? 'active' : ''}`}
          onClick={() => setTool('rect')}
          title="Rectangle Tool"
        >
          <span className="tool-icon">□</span>
          <span className="tool-label">Rectangle</span>
        </button>
        <button
          className={`tool-button ${tool === 'circle' ? 'active' : ''}`}
          onClick={() => setTool('circle')}
          title="Circle Tool"
        >
          <span className="tool-icon">○</span>
          <span className="tool-label">Circle</span>
        </button>
        <button
          className={`tool-button ${tool === 'triangle' ? 'active' : ''}`}
          onClick={() => setTool('triangle')}
          title="Triangle Tool"
        >
          <span className="tool-icon">△</span>
          <span className="tool-label">Triangle</span>
        </button>
        <button
          className={`tool-button ${tool === 'annotate' ? 'active' : ''}`}
          onClick={() => setTool('annotate')}
          title="Annotation Tool"
        >
          <span className="tool-icon">📏</span>
          <span className="tool-label">Measure</span>
        </button>
        <button
          className={`tool-button ${tool === 'select' ? 'active' : ''}`}
          onClick={() => setTool('select')}
          title="Select Tool"
        >
          <span className="tool-icon">✓</span>
          <span className="tool-label">Select</span>
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
          className={`tool-button ${!showAnnotations ? 'active' : ''}`}
          onClick={onToggleAnnotations}
          title="Toggle Annotations Visibility"
        >
          <span className="tool-icon">{showAnnotations ? '👁️' : '👁️‍🗨️'}</span>
          <span className="tool-label">{showAnnotations ? 'Hide Annotations' : 'Show Annotations'}</span>
        </button>
      </div>
      
      <div className="tool-group">
        <button
          className="tool-button"
          onClick={onSave}
          title="Save Drawing"
        >
          <span className="tool-icon">💾</span>
          <span className="tool-label">Save</span>
        </button>
        <button
          className="tool-button"
          onClick={onLoad}
          title="Load Drawing"
        >
          <span className="tool-icon">📂</span>
          <span className="tool-label">Load</span>
        </button>
        <button
          className="tool-button"
          onClick={onClear}
          title="Clear Canvas"
        >
          <span className="tool-icon">🗑️</span>
          <span className="tool-label">Clear</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;