import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainApp from './components/MainApp';
import GameDetails from './components/GameDetails';
import { Game } from './types/game';
import { fetchTopRatedGames } from './services/api';

//A new variable called App which includes an array games, a loading state, and an error
const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

//A useEffect hook that calls the fetchtopratedgames function

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchTopRatedGames();
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
        <div className="loading">Loading games...</div>
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