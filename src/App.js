import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DriverSelection from './components/DriverSelection';
import StatsComparison from './components/StatsComparison';
import AIAnalysis from './components/AIAnalysis';
// === CORRECTED Import Path ===
import driversData from './assests/data/drivers.json';
// === CORRECTED CSS Import ===
import './styles/global.css';

function App() {
  const [drivers, setDrivers] = useState([]);
  const [driver1, setDriver1] = useState(null);
  const [driver2, setDriver2] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Ensure driversData is loaded correctly
    if (driversData && Array.isArray(driversData)) {
      // Simulate loading data (e.g., API call)
      const timer = setTimeout(() => {
        setDrivers(driversData);
        setIsLoading(false); // Set loading to false after data is ready

        // Remove the initial loader from the DOM after animation
        const loaderElement = document.getElementById('initial-loader');
        if (loaderElement) {
          loaderElement.classList.add('hidden');
          // Optional: Remove element completely after transition
          setTimeout(() => loaderElement.remove(), 500);
        }
      }, 1500); // Simulate 1.5 seconds loading time

      return () => clearTimeout(timer); // Cleanup timer on unmount
    } else {
      console.error('Failed to load or parse drivers data.');
      setIsLoading(false); // Stop loading even if data failed
      const loaderElement = document.getElementById('initial-loader');
      if (loaderElement) {
        loaderElement.classList.add('hidden');
        setTimeout(() => loaderElement.remove(), 500);
      }
      // Handle the error appropriately, maybe show an error message
    }
  }, []);

  // Don't render the main app until loading is complete
  // index.html handles the visible loader
  if (isLoading) {
    return null;
  }

  // Handle case where driver data failed to load
  if (!drivers.length && !isLoading) {
    return (
      <div className="App">
        <Header />
        <main className="app-container" style={{ textAlign: 'center', padding: '50px 20px', color: '#ff4d4d' }}>
          <h2>Error Loading Data</h2>
          <p>Could not load F1 driver data. Please check the console or try refreshing.</p>
        </main>
        <footer style={{ textAlign: 'center', padding: '20px', marginTop: '40px', color: '#777', borderTop: '1px solid #333' }}>
          F1 Data Analyzer © {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  // Render the main application content
  return (
    <div className="App">
      <Header />
      <main className="app-container">
        <section className="section-padding" id="home">
          <DriverSelection
            drivers={drivers}
            setDriver1={setDriver1}
            setDriver2={setDriver2}
            selectedDriverId1={driver1 ? driver1.id : null}
            selectedDriverId2={driver2 ? driver2.id : null}
          />
        </section>

        {driver1 && driver2 && (
          <section className="section-padding" id="comparison">
            <StatsComparison driver1={driver1} driver2={driver2} />
          </section>
        )}

        {driver1 && driver2 && (
          <section className="section-padding" id="analysis">
            <AIAnalysis driver1={driver1} driver2={driver2} />
          </section>
        )}

        {/* Placeholder if no drivers are selected yet after load */}
        {!driver1 && !driver2 && !isLoading && drivers.length > 0 && (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#aaa' }}>
            <h2>Welcome to the F1 Performance Analyzer</h2>
            <p>Select two drivers above to start the comparison.</p>
          </div>
        )}
      </main>
      {/* Optional Footer */}
      <footer style={{ textAlign: 'center', padding: '20px', marginTop: '40px', color: '#777', borderTop: '1px solid #333' }}>
        F1 Data Analyzer © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;