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

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StatsComparison({ driver1, driver2 }) {
  const [view, setView] = useState('cards'); // 'cards' or 'graph'

  if (!driver1 || !driver2) {
    return (
      <div className="stats-comparison">
        <h2>Select two drivers to compare their stats.</h2>
      </div>
    );
  }

  // Data for the bar chart
  const chartData = {
    labels: ['Wins', 'Podiums', 'Poles'], // Categories for the stats
    datasets: [
      {
        label: driver1.name,
        data: [driver1.wins, driver1.podiums, driver1.poles],
        backgroundColor: 'rgba(211, 47, 47, 0.8)', // F1 Red with alpha
        borderColor: 'rgba(211, 47, 47, 1)',
        borderWidth: 1,
        borderRadius: 5,
        borderSkipped: false,
      },
      {
        label: driver2.name,
        data: [driver2.wins, driver2.podiums, driver2.poles],
        backgroundColor: 'rgba(54, 162, 235, 0.7)', // Contrasting Blue
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  // Chart options for dark mode
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e0e0e0', // Light legend text
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `Career Stats: ${driver1.name} vs ${driver2.name}`,
        color: '#ffffff',
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#e0e0e0',
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e0e0e0', // Light x-axis labels
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(224, 224, 224, 0.2)', // Lighter grid lines
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#e0e0e0', // Light y-axis labels
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(224, 224, 224, 0.2)', // Lighter grid lines
        },
      },
    },
    elements: {
      bar: {
        barThickness: 'flex',
        maxBarThickness: 50, // Adjust max bar thickness
      },
    },
  };

  // Toggle between card view and graph view
  const handleToggleView = () => {
    setView(view === 'cards' ? 'graph' : 'cards');
  };

  return (
    <div className="stats-comparison" id="comparison">
      <h2>Driver Stats Comparison</h2>

      <div className="view-toggle">
        <button onClick={handleToggleView}>
          {view === 'cards' ? 'Show Graph View' : 'Show Card View'}
        </button>
      </div>

      <div className="driver-cards">
        {view === 'cards' ? (
          // Driver cards view
          <>
            {[driver1, driver2].map((driver, index) => (
              <div className="driver-card" key={driver.id || index}>
                <img src={driver.image} alt={driver.name} className="driver-image" />
                <h3>{driver.name}</h3>
                <div className="stats">
                  <p><strong>Wins:</strong> {driver.wins}</p>
                  <p><strong>Podiums:</strong> {driver.podiums}</p>
                  <p><strong>Poles:</strong> {driver.poles}</p>
                  {/* Add more stats if available in drivers.json */}
                  {/* <p><strong>Fastest Laps:</strong> {driver.fastestLaps || 'N/A'}</p> */}
                  {/* <p><strong>Championships:</strong> {driver.championships || 'N/A'}</p> */}
                </div>
              </div>
            ))}
          </>
        ) : (
          // Graph view within a card-like container
          <div className="driver-card graph-card">
             <div className="stats-graph">
               <div className="chart-container">
                 <Bar data={chartData} options={chartOptions} />
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}

export default StatsComparison;