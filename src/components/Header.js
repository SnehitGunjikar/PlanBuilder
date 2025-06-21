import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">  
        <div className="logo-container">
        </div>
        <h1 className="app-title">Building Planner</h1>
      </div>
      <div className="header-actions">
        <span className="header-subtitle">Design your space with precision</span>
      </div>
    </header>
  );
};

export default Header;