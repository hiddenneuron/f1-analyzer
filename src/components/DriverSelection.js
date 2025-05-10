import React from 'react';
import './DriverSelection.css';

function DriverSelection({ drivers, setDriver1, setDriver2, selectedDriverId1, selectedDriverId2 }) {

  const handleDriver1Change = (e) => {
    const selectedId = e.target.value;
    const driver = drivers.find(d => d.id === selectedId) || null;
    setDriver1(driver);
  };

  const handleDriver2Change = (e) => {
    const selectedId = e.target.value;
    const driver = drivers.find(d => d.id === selectedId) || null;
    setDriver2(driver);
  };

  return (
    <div className="driver-selection" id="home">
      <h2>Select Drivers to Compare</h2>
      <div className="dropdown-container">
        <select value={selectedDriverId1 || ""} onChange={handleDriver1Change}>
          <option value="">Select Driver 1</option>
          {drivers.map(driver => (
            <option key={driver.id} value={driver.id} disabled={driver.id === selectedDriverId2}>
              {driver.name}
            </option>
          ))}
        </select>

        <select value={selectedDriverId2 || ""} onChange={handleDriver2Change}>
          <option value="">Select Driver 2</option>
          {drivers.map(driver => (
            <option key={driver.id} value={driver.id} disabled={driver.id === selectedDriverId1}>
              {driver.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DriverSelection;
