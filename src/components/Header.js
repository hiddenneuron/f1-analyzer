import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h1>F1 Performance <span>Analyzer</span></h1>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#comparison">Comparison</a></li>
            <li><a href="#analysis">AI Analysis</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
