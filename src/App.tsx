import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainApp from './components/MainApp';
import GameDetails from './components/GameDetails';
import { Game } from './types/game';
import { GAMES_PER_PAGE } from './components/MainApp';

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Initial loading state will be handled by MainApp
    setLoading(false);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setSearchQuery(''); // Reset search state
    console.log(`Loading more games for page: ${nextPage}`);
  };

  const resetSearchQuery = () => setSearchQuery('');

  if (loading) {
    return (
      <div className="main-app">
        <h1>Best New Indie Games</h1>
        <div className="loading">
          <span className="loading-text">Loading games...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-app">
        <h1>Best New Indie Games</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainApp games={games} setGames={setGames} onLoadMore={handleLoadMore} resetSearchQuery={resetSearchQuery} page={page} />} />
      <Route path="/game/:id" element={<GameDetails games={games} />} />
    </Routes>
  );
};

export default App;