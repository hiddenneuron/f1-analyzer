// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DriverSelection from './components/DriverSelection';
import StatsComparison from './components/StatsComparison';
import AIAnalysis from './components/AIAnalysis';
import './index.css';

const DEFAULT_IMAGE_URL = './images/default-driver.png';

function App() {
  const [latestApiYear, setLatestApiYear] = useState(new Date().getFullYear());
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [currentSeasonStandings, setCurrentSeasonStandings] = useState([]);
  const [currentSeasonRacesHeld, setCurrentSeasonRacesHeld] = useState(0);

  const [driver1, setDriver1] = useState(null);
  const [driver2, setDriver2] = useState(null);

  const [statsDisplayMode, setStatsDisplayMode] = useState('current');

  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [isLoadingDriver1, setIsLoadingDriver1] = useState(false);
  const [isLoadingDriver2, setIsLoadingDriver2] = useState(false);
  const [appError, setAppError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      console.log("Attempting to fetch initial F1 data...");
      setIsLoadingApp(true);
      let determinedLatestYear = new Date().getFullYear();

      try {
        // ... (rest of fetchInitialData - no changes here) ...
        try {
          const seasonsResponse = await fetch('https://ergast.com/api/f1/seasons.json?limit=200&offset=0&sort=desc');
          if (seasonsResponse.ok) {
            const seasonsData = await seasonsResponse.json();
            if (seasonsData.MRData && seasonsData.MRData.SeasonTable && seasonsData.MRData.SeasonTable.Seasons && seasonsData.MRData.SeasonTable.Seasons.length > 0) {
              determinedLatestYear = seasonsData.MRData.SeasonTable.Seasons[seasonsData.MRData.SeasonTable.Seasons.length - 1].season;
              setLatestApiYear(determinedLatestYear);
              console.log(`Latest available F1 season determined from API: ${determinedLatestYear}`);
            } else {
              console.warn('Could not determine latest season from API, using current system year as fallback.');
            }
          } else {
            console.warn(`Failed to fetch seasons (status: ${seasonsResponse.status}), using current system year as fallback.`);
          }
        } catch (seasonError) {
          console.warn('Error fetching seasons:', seasonError, 'Using current system year as fallback.');
        }

        let primaryFetchSuccessful = false;
        const driversListResponse = await fetch(`https://ergast.com/api/f1/${determinedLatestYear}/drivers.json?limit=200`);
        if (driversListResponse.ok) {
          const driversListData = await driversListResponse.json();
          if (driversListData.MRData && driversListData.MRData.DriverTable && driversListData.MRData.DriverTable.Drivers && driversListData.MRData.DriverTable.Drivers.length > 0) {
            setAvailableDrivers(driversListData.MRData.DriverTable.Drivers.map(d => ({
              id: d.driverId,
              name: `${d.givenName} ${d.familyName}`,
              givenName: d.givenName,
              familyName: d.familyName,
              nationality: d.nationality,
              permanentNumber: d.permanentNumber,
              url: d.url
            })));
            primaryFetchSuccessful = true;
            console.log(`Successfully fetched and set drivers for year ${determinedLatestYear}. Count: ${driversListData.MRData.DriverTable.Drivers.length}`);
          } else {
            console.warn(`Primary driver list for ${determinedLatestYear} was empty or malformed. Will attempt fallback.`);
          }
        } else {
          console.warn(`Primary drivers list fetch for ${determinedLatestYear} failed with status: ${driversListResponse.status}. Will attempt fallback.`);
        }

        if (!primaryFetchSuccessful) {
          console.log("Attempting fallback for drivers list (all historical drivers)...");
          const fallbackDriversResponse = await fetch(`https://ergast.com/api/f1/drivers.json?limit=1200`);
          if (fallbackDriversResponse.ok) {
            const fallbackDriversData = await fallbackDriversResponse.json();
            if (fallbackDriversData.MRData && fallbackDriversData.MRData.DriverTable && fallbackDriversData.MRData.DriverTable.Drivers && fallbackDriversData.MRData.DriverTable.Drivers.length > 0) {
              setAvailableDrivers(fallbackDriversData.MRData.DriverTable.Drivers.map(d => ({
                id: d.driverId,
                name: `${d.givenName} ${d.familyName}`,
                givenName: d.givenName,
                familyName: d.familyName,
                nationality: d.nationality,
                permanentNumber: d.permanentNumber,
                url: d.url
              })).sort((a, b) => a.familyName.localeCompare(b.familyName)));
              console.log(`Successfully fetched and set fallback drivers list. Count: ${fallbackDriversData.MRData.DriverTable.Drivers.length}`);
            } else {
              throw new Error('Fallback driver data is empty or not in expected format.');
            }
          } else {
            throw new Error(`Fallback drivers list fetch failed with status: ${fallbackDriversResponse.status}`);
          }
        }

        const standingsResponse = await fetch(`https://ergast.com/api/f1/current/driverStandings.json?limit=100`);
        if (!standingsResponse.ok) throw new Error(`Failed to fetch standings: ${standingsResponse.status}`);
        const standingsData = await standingsResponse.json();
        if (standingsData.MRData && standingsData.MRData.StandingsTable && standingsData.MRData.StandingsTable.StandingsLists && standingsData.MRData.StandingsTable.StandingsLists.length > 0) {
          const standingsList = standingsData.MRData.StandingsTable.StandingsLists[0];
          setCurrentSeasonStandings(standingsList.DriverStandings);
          setCurrentSeasonRacesHeld(parseInt(standingsList.round, 10));
          console.log(`Current season standings fetched for season ${standingsList.season}, round ${standingsList.round}.`);
        } else {
          console.warn('Current season standings not yet available or in an unexpected format.');
          setCurrentSeasonStandings([]);
          setCurrentSeasonRacesHeld(0);
        }
        setAppError(null);
      } catch (error) {
        console.error('Critical error fetching initial F1 data:', error);
        setAppError(error.message || 'Could not fetch initial F1 data. The API might be down or data is unavailable.');
        setAvailableDrivers([]);
      } finally {
        setIsLoadingApp(false);
        console.log("Initial data fetching process finished.");
        const loaderElement = document.getElementById('initial-loader');
        if (loaderElement) {
          loaderElement.classList.add('hidden');
          setTimeout(() => { try { loaderElement.remove(); } catch (e) { /* ignore */ } }, 500);
        }
      }
    };
    fetchInitialData();
  }, []);

  const fetchDriverDetails = useCallback(async (driverId, baseDriverInfo) => {
    // ... (fetchDriverDetails remains the same) ...
    if (!driverId || !baseDriverInfo) return null;
    console.log(`Fetching details for ${baseDriverInfo.name} (${driverId})`);
    try {
      let imageUrl = DEFAULT_IMAGE_URL;
      if (baseDriverInfo.url) {
        const driverWikiTitle = baseDriverInfo.url.split('/').pop();
        try {
          const wikiResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(driverWikiTitle)}&prop=pageimages&format=json&pithumbsize=200&origin=*`);
          if (wikiResponse.ok) {
            const wikiData = await wikiResponse.json();
            const pages = wikiData.query.pages;
            const pageId = Object.keys(pages)[0];
            if (pageId !== "-1" && pages[pageId].thumbnail) {
              imageUrl = pages[pageId].thumbnail.source;
            }
          }
        } catch (wikiError) {
          console.warn(`Could not fetch image for ${baseDriverInfo.name} from Wikipedia:`, wikiError);
        }
      }

      const currentStanding = currentSeasonStandings.find(ds => ds.Driver.driverId === driverId);
      const currentStats = {
        wins: currentStanding ? parseInt(currentStanding.wins, 10) : 0,
        podiums: 0,
        poles: 0,
        points: currentStanding ? parseInt(currentStanding.points, 10) : 0,
        team: currentStanding && currentStanding.Constructors && currentStanding.Constructors.length > 0 ? currentStanding.Constructors[0].name : 'N/A',
        races: currentSeasonRacesHeld
      };

      const [resultsResponse, overallWinsResponse, overallPolesResponse] = await Promise.all([
        fetch(`https://ergast.com/api/f1/drivers/${driverId}/results.json?limit=1000`),
        fetch(`https://ergast.com/api/f1/drivers/${driverId}/results/1.json?limit=1`),
        fetch(`https://ergast.com/api/f1/drivers/${driverId}/qualifying/1.json?limit=1`)
      ]);

      if (!resultsResponse.ok) throw new Error('Failed to fetch career results.');
      if (!overallWinsResponse.ok) throw new Error('Failed to fetch career wins count.');
      if (!overallPolesResponse.ok) throw new Error('Failed to fetch career poles count.');

      const resultsData = await resultsResponse.json();
      const overallWinsData = await overallWinsResponse.json();
      const overallPolesData = await overallPolesResponse.json();

      let overallWins = 0, overallPodiums = 0, careerRaces = 0, overallPoints = 0, overallPoles = 0;

      if (overallWinsData.MRData && overallWinsData.MRData.total) {
        overallWins = parseInt(overallWinsData.MRData.total, 10);
      }
      if (overallPolesData.MRData && overallPolesData.MRData.total) {
        overallPoles = parseInt(overallPolesData.MRData.total, 10);
      }

      if (resultsData.MRData && resultsData.MRData.RaceTable && resultsData.MRData.RaceTable.Races) {
        careerRaces = parseInt(resultsData.MRData.total, 10);
        resultsData.MRData.RaceTable.Races.forEach(race => {
          if (race.Results && race.Results[0]) {
            const result = race.Results[0];
            const pos = parseInt(result.position, 10);
            if (pos >= 1 && pos <= 3) overallPodiums++;
            overallPoints += parseInt(result.points, 10);
          }
        });
      }

      const overallStats = {
        wins: overallWins,
        podiums: overallPodiums,
        poles: overallPoles,
        races: careerRaces,
        points: overallPoints
      };

      return {
        ...baseDriverInfo,
        image: imageUrl,
        currentStats,
        overallStats
      };
    } catch (error) {
      console.error(`Error fetching details for driver ${baseDriverInfo.name} (${driverId}):`, error);
      return { ...baseDriverInfo, image: DEFAULT_IMAGE_URL, error: 'Failed to load details', currentStats: { wins: 0, podiums: 0, poles: 0, points: 0, team: 'N/A', races: 0 }, overallStats: { wins: 0, podiums: 0, poles: 0, points: 0, races: 0 } };
    }
  }, [currentSeasonStandings, currentSeasonRacesHeld]);

  const handleSetDriver1 = useCallback(async (selectedDriverBaseInfo) => {
    if (!selectedDriverBaseInfo) { // If unselecting
      setDriver1(null);
      return;
    }
    setIsLoadingDriver1(true);
    // DO NOT setDriver1(null) here if it's an update, to keep layout stable.
    // Child components will use isLoadingDriver1 prop.
    const detailedDriver = await fetchDriverDetails(selectedDriverBaseInfo.id, selectedDriverBaseInfo);
    setDriver1(detailedDriver);
    setIsLoadingDriver1(false);
  }, [fetchDriverDetails]);

  const handleSetDriver2 = useCallback(async (selectedDriverBaseInfo) => {
    if (!selectedDriverBaseInfo) { // If unselecting
      setDriver2(null);
      return;
    }
    setIsLoadingDriver2(true);
    // DO NOT setDriver2(null) here if it's an update.
    const detailedDriver = await fetchDriverDetails(selectedDriverBaseInfo.id, selectedDriverBaseInfo);
    setDriver2(detailedDriver);
    setIsLoadingDriver2(false);
  }, [fetchDriverDetails]);

  if (isLoadingApp) {
    return null;
  }

  if (appError && availableDrivers.length === 0) {
    return (
      <div className="App">
        <Header />
        <main className="app-container error-container">
          <h2>Error Loading Application Data</h2>
          <p>{appError}</p>
          <p>The F1 data API might be temporarily unavailable or data for the requested year (latest: {latestApiYear}) isn't ready. Please try refreshing later.</p>
        </main>
        <footer style={{ textAlign: 'center', padding: '20px', marginTop: '40px', color: '#777', borderTop: '1px solid #333' }}>
          F1 Data Analyzer © {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="app-container">
        <section className="section-padding" id="home">
          <DriverSelection
            drivers={availableDrivers}
            setDriver1Callback={handleSetDriver1}
            setDriver2Callback={handleSetDriver2}
            selectedDriver1Id={driver1 ? driver1.id : null}
            selectedDriver2Id={driver2 ? driver2.id : null}
            isLoadingDriver1={isLoadingDriver1}
            isLoadingDriver2={isLoadingDriver2}
          />
        </section>

        {appError && availableDrivers.length > 0 &&
          <p className="app-level-error-inline">Notice: {appError}. Some data might be incomplete or using fallbacks.</p>
        }

        {(driver1 && driver2) && (
          <div className="stats-view-controls">
            <button
              onClick={() => setStatsDisplayMode('current')}
              className={statsDisplayMode === 'current' ? 'active-stats-type' : ''}
              disabled={isLoadingDriver1 || isLoadingDriver2} // Disable while loading to prevent state issues
            >
              Current Season Stats
            </button>
            <button
              onClick={() => setStatsDisplayMode('overall')}
              className={statsDisplayMode === 'overall' ? 'active-stats-type' : ''}
              disabled={isLoadingDriver1 || isLoadingDriver2} // Disable while loading
            >
              Overall Career Stats
            </button>
          </div>
        )}

        {/* Removed the generic loading message from here */}

        {/* Always render StatsComparison and AIAnalysis if drivers are selected,
            they will handle their internal loading state */}
        {driver1 && driver2 && (
          <>
            <section className="section-padding" id="comparison">
              <StatsComparison
                driver1={driver1}
                driver2={driver2}
                statsType={statsDisplayMode}
                isLoadingDriver1={isLoadingDriver1}
                isLoadingDriver2={isLoadingDriver2}
              />
            </section>
            <section className="section-padding" id="analysis">
              <AIAnalysis
                driver1={driver1}
                driver2={driver2}
                statsType={statsDisplayMode}
                isLoadingDriver1={isLoadingDriver1}
                isLoadingDriver2={isLoadingDriver2}
              />
            </section>
          </>
        )}

        {/* Welcome/placeholder messages */}
        {availableDrivers.length === 0 && !isLoadingApp && !appError && (
          <div className="welcome-message">
            <h2>No Drivers Found</h2>
            <p>Could not retrieve a list of drivers from the API for year {latestApiYear} or historical records. The API might be temporarily unavailable or data is missing. Please try refreshing later.</p>
          </div>
        )}

        {/* Show welcome message if drivers are available but none are selected,
            AND no driver details are currently being loaded.
            If isLoadingDriver1 or isLoadingDriver2 is true, it means a selection has been made or is in progress.
         */}
        {availableDrivers.length > 0 && !(driver1 && driver2) && !isLoadingDriver1 && !isLoadingDriver2 && (
          <div className="welcome-message">
            <h2>Welcome to the F1 Performance Analyzer</h2>
            <p>Select two drivers above to start the comparison. You can toggle between Current Season and Overall Career stats once drivers are selected.</p>
            <p style={{ fontSize: '0.9em', color: '#999' }}>Data for the driver list is primarily from the {latestApiYear} F1 season. 'Current Season' stats reflect the latest official standings. Podium and Pole data for current season are often placeholders (0) in summary APIs; overall career stats are more comprehensive for these metrics.</p>
          </div>
        )}
      </main>
      <footer style={{ textAlign: 'center', padding: '20px', marginTop: '40px', color: '#777', borderTop: '1px solid #333' }}>
        F1 Data Analyzer © {new Date().getFullYear()} | Data from <a href="http://ergast.com/mrd/" target="_blank" rel="noopener noreferrer" style={{ color: '#999' }}>Ergast API</a>
      </footer>
    </div>
  );
}

export default App;