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
import './StatsComparison.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StatsComparison({ driver1, driver2, statsType }) {
  const [view, setView] = useState('cards'); // 'cards' or 'graph'

  if (!driver1 || !driver2) {
    return (
      <div className="stats-comparison">
        <h2 className="placeholder-message">Select two drivers to compare their stats.</h2>
      </div>
    );
  }
  if (driver1.error || driver2.error) {
    let message = "Select two drivers to compare their stats.";
    if (driver1 && driver1.error && driver2 && driver2.error) message = `Error loading data for both drivers.`;
    else if (driver1 && driver1.error) message = `Error loading data for ${driver1.name}.`;
    else if (driver2 && driver2.error) message = `Error loading data for ${driver2.name}.`;

    return (
      <div className="stats-comparison">
        <h2 className="placeholder-message">{message}</h2>
      </div>
    );
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

  const renderDriverCard = (driver, driverStats) => (
    <div className="driver-card" key={driver.id}>
      <img
        src={driver.image}
        alt={driver.name}
        className="driver-image"
        onError={(e) => { e.target.onerror = null; e.target.src = './images/default-driver.png';}}
      />
      <h3>{driver.name}</h3>
      <div className="stats">
        {statsType === 'current' && <p><strong>Team:</strong> <span>{driverStats.team || 'N/A'}</span></p>}
        <p><strong>Nationality:</strong> <span>{driver.nationality || 'N/A'}</span></p>
        <p><strong>Wins:</strong> <span>{driverStats.wins}</span></p>
        <p><strong>Podiums:</strong> <span>{driverStats.podiums} {(statsType === 'current' && driverStats.podiums === 0 && driver1.currentStats.races > 0) ? '(Note)' : ''}</span></p>
        <p><strong>Poles:</strong> <span>{driverStats.poles} {(statsType === 'current' && driverStats.poles === 0 && driver1.currentStats.races > 0) ? '(Note)' : ''}</span></p>
        <p><strong>Points:</strong> <span>{driverStats.points}</span></p>
        <p><strong>Races:</strong> <span>{driverStats.races}</span></p>
      </div>
    </div>
  );

  const shouldShowApiNote = statsType === 'current' &&
                            driver1.currentStats.races > 0 &&
                            (driver1.currentStats.podiums === 0 ||
                             driver1.currentStats.poles === 0 ||
                             driver2.currentStats.podiums === 0 ||
                             driver2.currentStats.poles === 0);

  return (
    <div className="stats-comparison" id="comparison">
      <h2>Driver Stats Comparison ({titleSuffix})</h2>
      <div className="view-toggle">
        <button onClick={handleToggleView}>
          {view === 'cards' ? 'Show Graph View' : 'Show Card View'}
        </button>
      </div>
      <div className={`view-content ${view === 'graph' ? 'graph-active' : 'cards-active'}`}>
        {view === 'cards' ? (
          <div className="driver-cards-container">
            {renderDriverCard(driver1, d1Stats)}
            {renderDriverCard(driver2, d2Stats)}
          </div>
        ) : (
          <div className="graph-view-container">
            <div className="stats-graph">
              <div className="chart-container">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="api-note-container">
        {shouldShowApiNote && (
          <p className="api-note">Note: Current season podium and pole data are often placeholders (0) in summary APIs and may not reflect actual performance. Overall career stats are more comprehensive for these metrics.</p>
        )}
      </div>
    </div>
  );
}

export default StatsComparison;