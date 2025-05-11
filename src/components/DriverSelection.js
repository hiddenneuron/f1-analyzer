import React from 'react';
import './DriverSelection.css'; // Uses the CSS above

// Props are from the "new" App.js
function DriverSelection({
  drivers,
  setDriver1Callback,
  setDriver2Callback,
  selectedDriver1Id,
  selectedDriver2Id,
  isLoadingDriver1,
  isLoadingDriver2
}) {

  const handleDriver1Change = (e) => {
    const selectedId = e.target.value;
    // Find from the `availableDrivers` list passed from App.js (new data source)
    const driverBaseInfo = drivers.find(d => d.id === selectedId) || null;
    setDriver1Callback(driverBaseInfo);
  };

  const handleDriver2Change = (e) => {
    const selectedId = e.target.value;
    const driverBaseInfo = drivers.find(d => d.id === selectedId) || null;
    setDriver2Callback(driverBaseInfo);
  };

  // Message if drivers array is empty (from new App.js logic)
  if (!drivers || drivers.length === 0) {
    return (
      <div className="driver-selection" id="home">
        <h2>Select Drivers to Compare</h2>
        <p className="no-drivers-message">
          No drivers available to select. Data might be loading or unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="driver-selection" id="home">
      <h2>Select Drivers to Compare</h2>
      <div className="dropdown-container">
        {/* Old structure didn't have a wrapper, but it helps for loader placement */}
        <div className="dropdown-wrapper">
          <select
            value={selectedDriver1Id || ""}
            onChange={handleDriver1Change}
            disabled={isLoadingDriver1 || isLoadingDriver2 || drivers.length === 0}
          >
            <option value="">Select Driver 1</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id} disabled={driver.id === selectedDriver2Id}>
                {driver.name} {driver.permanentNumber ? `(#${driver.permanentNumber})` : ''}
              </option>
            ))}
          </select>
          {isLoadingDriver1 && <div className="loader-small"></div>}
        </div>

        <div className="dropdown-wrapper">
          <select
            value={selectedDriver2Id || ""}
            onChange={handleDriver2Change}
            disabled={isLoadingDriver1 || isLoadingDriver2 || drivers.length === 0}
          >
            <option value="">Select Driver 2</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id} disabled={driver.id === selectedDriver1Id}>
                {driver.name} {driver.permanentNumber ? `(#${driver.permanentNumber})` : ''}
              </option>
            ))}
          </select>
          {isLoadingDriver2 && <div className="loader-small"></div>}
        </div>
      </div>
    </div>
  );
}

export default DriverSelection;