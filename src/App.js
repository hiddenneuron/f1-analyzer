import React from 'react';
import { Activity, BarChart3, Brain } from 'lucide-react';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      
      <main className="app-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>F1 Performance <span>Analyzer</span></h1>
            <p className="hero-subtitle">Compare Formula 1 drivers head-to-head with advanced statistics and AI-powered analysis</p>
            <a href="#comparison" className="cta-button">Start Comparing</a>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Activity className="feature-icon" />
              <h3>Real-Time Stats</h3>
              <p>Access up-to-date performance metrics for current and historical F1 drivers</p>
            </div>
            <div className="feature-card">
              <BarChart3 className="feature-icon" />
              <h3>Visual Comparisons</h3>
              <p>Compare drivers with interactive charts and detailed statistical breakdowns</p>
            </div>
            <div className="feature-card">
              <Brain className="feature-icon" />
              <h3>AI Analysis</h3>
              <p>Get intelligent insights and performance predictions powered by advanced analytics</p>
            </div>
          </div>
        </section>

        {/* Driver Selection Section */}
        <section id="comparison" className="comparison-section">
          <div className="section-content">
            <h2>Compare F1 Drivers</h2>
            <p>Select two drivers to begin your analysis</p>
            <div className="driver-selection-container">
              {/* Your existing DriverSelection component will be rendered here */}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>F1 Performance Analyzer © {new Date().getFullYear()} | Data from <a href="http://ergast.com/mrd/" target="_blank" rel="noopener noreferrer">Ergast API</a></p>
      </footer>
    </div>
  );
}

export default App;