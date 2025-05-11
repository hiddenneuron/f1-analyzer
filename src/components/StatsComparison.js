import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './StatsComparison.css'; // Assumes CSS from previous "old UI + min-height" step

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Props from new App.js
function StatsComparison({ driver1, driver2, statsType, isLoadingDriver1, isLoadingDriver2 }) {
  const [view, setView] = useState('cards');

  if (!driver1 || !driver2) {
    return (
      <div className="stats-comparison">
        <h2 className="placeholder-message-old-stats">Select two drivers to compare their stats.</h2>
      </div>
    );
  }

  // Error handling
  if (driver1.error && !isLoadingDriver1) {
    return <div className="stats-comparison"><h2 className="placeholder-message-old-stats">Error loading data for {driver1.name || 'Driver 1'}.</h2></div>;
  }
  if (driver2.error && !isLoadingDriver2) {
    return <div className="stats-comparison"><h2 className="placeholder-message-old-stats">Error loading data for {driver2.name || 'Driver 2'}.</h2></div>;
  }

  const d1Stats = statsType === 'current' ? driver1.currentStats : driver1.overallStats;
  const d2Stats = statsType === 'current' ? driver2.currentStats : driver2.overallStats;
  const titleSuffix = statsType === 'current' ? 'Current Season' : 'Overall Career';

  const chartData = {
    labels: ['Wins', 'Podiums', 'Poles', 'Points'],
    datasets: [
      {
        label: driver1.name,
        data: [d1Stats.wins, d1Stats.podiums, d1Stats.poles, d1Stats.points],
        backgroundColor: 'rgba(211, 47, 47, 0.8)',
        borderColor: 'rgba(211, 47, 47, 1)',
        borderWidth: 1, borderRadius: 5, borderSkipped: false,
      },
      {
        label: driver2.name,
        data: [d2Stats.wins, d2Stats.podiums, d2Stats.poles, d2Stats.points],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1, borderRadius: 5, borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e0e0e0', font: { size: 14 } } },
      title: { display: true, text: `${titleSuffix} Stats: ${driver1.name} vs ${driver2.name}`, color: '#ffffff', font: { size: 16 } },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: '#ffffff', bodyColor: '#e0e0e0',
        callbacks: { label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}` },
      },
    },
    scales: {
      x: { ticks: { color: '#e0e0e0', font: { size: 12 } }, grid: { color: 'rgba(224, 224, 224, 0.2)' } },
      y: { beginAtZero: true, ticks: { color: '#e0e0e0', font: { size: 12 } }, grid: { color: 'rgba(224, 224, 224, 0.2)' } },
    },
    elements: { bar: { barThickness: 'flex', maxBarThickness: 50 } },
  };

  const handleToggleView = () => setView(view === 'cards' ? 'graph' : 'cards');

  const renderSingleDriverCard = (driverData, statsData, isLoadingFlag) => (
    <div className="driver-card" key={driverData.id}>
      {isLoadingFlag ? (
        <div className="card-loader-overlay">
          <div className="loader-small" style={{ width: '50px', height: '50px' }}></div>
          <p>Loading {driverData.name || 'Driver'}...</p>
        </div>
      ) : driverData.error ? (
         <div className="card-error-overlay">
            <p>Error loading data for {driverData.name}.</p>
        </div>
      ) : (
        <>
          <img
            src={driverData.image}
            alt={driverData.name}
            className="driver-image"
            onError={(e) => { e.target.onerror = null; e.target.src = './images/default-driver.png';}}
          />
          <h3>{driverData.name}</h3>
          <div className="stats">
            {/* FIX APPLIED HERE: Team line always rendered */}
            <p>
              <strong>Team:</strong>
              <span>
                {statsType === 'current' ? (statsData.team || 'N/A') : 'N/A (Career)'}
              </span>
            </p>
            <p><strong>Nationality:</strong> <span>{driverData.nationality || 'N/A'}</span></p>
            <p><strong>Wins:</strong> <span>{statsData.wins}</span></p>
            <p><strong>Podiums:</strong> <span>{statsData.podiums}</span></p>
            <p><strong>Poles:</strong> <span>{statsData.poles}</span></p>
            <p><strong>Points:</strong> <span>{statsData.points}</span></p>
            <p><strong>Races:</strong> <span>{statsData.races}</span></p>
          </div>
        </>
      )}
    </div>
  );

  const shouldShowApiNote =
    statsType === 'current' &&
    driver1.currentStats && driver2.currentStats &&
    !isLoadingDriver1 && !isLoadingDriver2 && !driver1.error && !driver2.error &&
    driver1.currentStats.races > 0 &&
    ( (driver1.currentStats.podiums === 0 || driver1.currentStats.poles === 0) ||
      (driver2.currentStats.podiums === 0 || driver2.currentStats.poles === 0) );


  return (
    <div className="stats-comparison" id="comparison">
      <h2>Driver Stats Comparison ({titleSuffix})</h2>
      <div className="view-toggle">
        <button onClick={handleToggleView} disabled={isLoadingDriver1 || isLoadingDriver2}>
          {view === 'cards' ? 'Show Graph View' : 'Show Card View'}
        </button>
      </div>

      <div className="driver-cards">
        {view === 'cards' ? (
          <>
            {renderSingleDriverCard(driver1, d1Stats, isLoadingDriver1)}
            {renderSingleDriverCard(driver2, d2Stats, isLoadingDriver2)}
          </>
        ) : (
          <div className="driver-card graph-card">
            {(isLoadingDriver1 || isLoadingDriver2) ? (
              <div className="graph-card-loader-overlay">
                <div className="loader-small" style={{ width: '60px', height: '60px' }}></div>
                <p>Loading chart data...</p>
              </div>
            ) : (driver1.error || driver2.error) ? (
                <div className="graph-card-loader-overlay">
                    <p>Cannot display graph due to data loading errors.</p>
                </div>
            ) : (
              <div className="stats-graph">
                <div className="chart-container">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="api-note-container">
        {shouldShowApiNote && (
          <p className="api-note">
            Note: Current season podium and pole data are often placeholders (0) in summary APIs and may not reflect actual performance. Overall career stats are more comprehensive for these metrics.
          </p>
        )}
      </div>
    </div>
  );
}

export default StatsComparison;