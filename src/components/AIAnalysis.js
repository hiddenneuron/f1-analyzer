import React from 'react';
import './AIAnalysis.css';

function AIAnalysis({ driver1, driver2, statsType }) {
  const generateAnalysis = () => {
    if (!driver1 || !driver2 ) {
      return <p>Select two drivers to generate AI analysis.</p>;
    }
    if (driver1.error || driver2.error) {
      return <p>Cannot generate analysis due to errors loading driver data.</p>;
    }

    const d1Stats = statsType === 'current' ? driver1.currentStats : driver1.overallStats;
    const d2Stats = statsType === 'current' ? driver2.currentStats : driver2.overallStats;
    const period = statsType === 'current' ? 'current season' : 'career';

    let analysis = [];
    analysis.push(`Comparing ${driver1.name} and ${driver2.name} based on ${period} statistics:`)
    if (statsType === 'current') {
      analysis.push(`(Current season data based on ${d1Stats.races > 0 ? d1Stats.races : 'available'} races held so far. Note: Current season podiums and poles are often not detailed in summary APIs and may show as 0 here; check overall career for full stats.)`);
    }

    // Wins
    if (d1Stats.wins > d2Stats.wins) {
      analysis.push(`${driver1.name} leads in ${period} wins (${d1Stats.wins} vs ${d2Stats.wins}).`);
    } else if (d2Stats.wins > d1Stats.wins) {
      analysis.push(`${driver2.name} leads in ${period} wins (${d2Stats.wins} vs ${d1Stats.wins}).`);
    } else {
      analysis.push(`Both drivers have the same number of ${period} wins (${d1Stats.wins}).`);
    }

    // Podiums (More meaningful for overall)
    if (statsType === 'overall' || d1Stats.podiums > 0 || d2Stats.podiums > 0) { // Show podiums if overall or if current has data
      if (d1Stats.podiums > d2Stats.podiums) {
        analysis.push(`${driver1.name} has achieved more ${period} podiums (${d1Stats.podiums} vs ${d2Stats.podiums}).`);
      } else if (d2Stats.podiums > d1Stats.podiums) {
        analysis.push(`${driver2.name} has achieved more ${period} podiums (${d2Stats.podiums} vs ${d1Stats.podiums}).`);
      } else {
        analysis.push(`They share the same number of ${period} podiums (${d1Stats.podiums}).`);
      }
    }

    // Poles (More meaningful for overall)
    if (statsType === 'overall' || d1Stats.poles > 0 || d2Stats.poles > 0) { // Show poles if overall or if current has data
      if (d1Stats.poles > d2Stats.poles) {
        analysis.push(`${driver1.name} boasts more ${period} pole positions (${d1Stats.poles} vs ${d2Stats.poles}).`);
      } else if (d2Stats.poles > d1Stats.poles) {
        analysis.push(`${driver2.name} boasts more ${period} pole positions (${d2Stats.poles} vs ${d1Stats.poles}).`);
      } else {
        analysis.push(`They have an equal number of ${period} pole positions (${d1Stats.poles}).`);
      }
    }

    // Points
    if (d1Stats.points > d2Stats.points) {
      analysis.push(`${driver1.name} has accumulated more points in their ${period} (${d1Stats.points} vs ${d2Stats.points}).`);
    } else if (d2Stats.points > d1Stats.points) {
      analysis.push(`${driver2.name} has accumulated more points in their ${period} (${d2Stats.points} vs ${d1Stats.points}).`);
    } else {
      analysis.push(`They have an equal number of points in their ${period} (${d1Stats.points}).`);
    }

    // Win Rate
    const races1 = d1Stats.races > 0 ? d1Stats.races : (d1Stats.wins > 0 ? d1Stats.wins : 1); // Avoid division by zero, use wins if races=0 but wins > 0
    const races2 = d2Stats.races > 0 ? d2Stats.races : (d2Stats.wins > 0 ? d2Stats.wins : 1);
    const winRate1 = d1Stats.races > 0 ? d1Stats.wins / races1 : (d1Stats.wins > 0 ? 1 : 0); // if races is 0, win rate is 100% if wins >0, else 0
    const winRate2 = d2Stats.races > 0 ? d2Stats.wins / races2 : (d2Stats.wins > 0 ? 1 : 0);

    if (d1Stats.races > 0 || d2Stats.races > 0 || d1Stats.wins > 0 || d2Stats.wins > 0) {
      if (winRate1 > winRate2) {
        analysis.push(`Based on ${period} win rate, ${driver1.name} (${(winRate1 * 100).toFixed(1)}%) has a higher victory frequency than ${driver2.name} (${(winRate2 * 100).toFixed(1)}%).`);
      } else if (winRate2 > winRate1) {
        analysis.push(`Based on ${period} win rate, ${driver2.name} (${(winRate2 * 100).toFixed(1)}%) has a higher victory frequency than ${driver1.name} (${(winRate1 * 100).toFixed(1)}%).`);
      } else {
        analysis.push(`Both drivers have a similar ${period} win rate of around ${(winRate1 * 100).toFixed(1)}%.`);
      }
    } else {
        analysis.push(`Win rate comparison for ${period} is not applicable as neither driver has recorded races or wins in this period.`);
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
      <h2>AI Analysis ({statsType === 'current' ? 'Current Season' : 'Overall Career'}): {driver1.name} vs {driver2.name}</h2>
      {generateAnalysis()}
    </div>
  );
}

export default AIAnalysis;