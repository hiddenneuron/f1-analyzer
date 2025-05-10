import React from 'react';
import './AIAnalysis.css';

function AIAnalysis({ driver1, driver2 }) {
  // Basic analysis (Placeholder - replace with actual AI logic or more detailed comparison)
  const generateAnalysis = () => {
    if (!driver1 || !driver2) return "Select two drivers first.";

    let analysis = [];

    analysis.push(`Comparing ${driver1.name} and ${driver2.name}:`);

    if (driver1.wins > driver2.wins) {
      analysis.push(`${driver1.name} leads in wins (${driver1.wins} vs ${driver2.wins}).`);
    } else if (driver2.wins > driver1.wins) {
      analysis.push(`${driver2.name} leads in wins (${driver2.wins} vs ${driver1.wins}).`);
    } else {
      analysis.push(`Both drivers have the same number of wins (${driver1.wins}).`);
    }

    if (driver1.podiums > driver2.podiums) {
      analysis.push(`${driver1.name} has achieved more podium finishes (${driver1.podiums} vs ${driver2.podiums}).`);
    } else if (driver2.podiums > driver1.podiums) {
      analysis.push(`${driver2.name} has achieved more podium finishes (${driver2.podiums} vs ${driver1.podiums}).`);
    } else {
      analysis.push(`They share the same number of podiums (${driver1.podiums}).`);
    }

    if (driver1.poles > driver2.poles) {
      analysis.push(`${driver1.name} boasts more pole positions (${driver1.poles} vs ${driver2.poles}).`);
    } else if (driver2.poles > driver1.poles) {
      analysis.push(`${driver2.name} boasts more pole positions (${driver2.poles} vs ${driver1.poles}).`);
    } else {
      analysis.push(`They have an equal number of pole positions (${driver1.poles}).`);
    }

    // Add a concluding remark (simple example)
    const winRate1 = driver1.wins / (driver1.races || 1); // Avoid division by zero
    const winRate2 = driver2.wins / (driver2.races || 1);
    if (winRate1 > winRate2) {
        analysis.push(`Based on win rate, ${driver1.name} has shown a higher frequency of victories.`);
    } else if (winRate2 > winRate1) {
        analysis.push(`Based on win rate, ${driver2.name} has shown a higher frequency of victories.`);
    }

    return analysis.map((point, index) => <p key={index}>{point}</p>);
  };

  if (!driver1 || !driver2) {
    return (
      <div className="ai-analysis" id="analysis">
        <h2 className="placeholder">AI Analysis</h2>
        <p>Please select two drivers to generate the AI analysis.</p>
      </div>
    );
  }

  return (
    <div className="ai-analysis" id="analysis">
      <h2>AI Analysis: {driver1.name} vs {driver2.name}</h2>
      {generateAnalysis()}
      {/* Future: Add loading indicator while fetching real AI data */}
      {/* <div className="loading-spinner"></div> */}
    </div>
  );
}

export default AIAnalysis;