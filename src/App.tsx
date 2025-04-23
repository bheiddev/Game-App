import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainApp from './components/MainApp';
import GameDetails from './components/GameDetails';
import { Game } from './types/game';
import { fetchTopRatedGames } from './services/api';

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchTopRatedGames((processed, total) => {
          setProcessedCount(processed);
          if (total) setTotalCount(total);
        });
        setGames(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load games');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  if (loading) {
    return (
      <div className="main-app">
        <h1>Top Rated Indie Games</h1>
        <div className="loading">
          <span className="loading-text">
            {totalCount > 0 
              ? `Loading games... ${processedCount} of ${totalCount} processed` 
              : "Loading games..."}
          </span>
          {totalCount > 0 && (
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(processedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-app">
        <h1>Top Rated Indie Games</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainApp games={games} />} />
      <Route path="/game/:id" element={<GameDetails games={games} />} />
    </Routes>
  );
};

export default App;