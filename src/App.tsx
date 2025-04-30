import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainApp from './components/MainApp';
import GameDetails from './components/GameDetails';
import { Game } from './types/game';
import { fetchTopRatedGames } from './services/api';

const GAMES_PER_PAGE = 36;

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Define loadGames function
  const loadGames = async (pageNum: number) => {
    console.log(`Loading games for page: ${pageNum}`);
    try {
      const newGames = await fetchTopRatedGames(pageNum * GAMES_PER_PAGE, GAMES_PER_PAGE);
      console.log('New games loaded:', newGames);
      setGames(prevGames => {
        const existingIds = new Set(prevGames.map(game => game.id));
        const uniqueNewGames = newGames.filter(game => !existingIds.has(game.id));
        const updatedGames = [...prevGames, ...uniqueNewGames];
        console.log('Updated games list:', updatedGames);
        return updatedGames;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames(0);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setSearchQuery(''); // Reset search state
    console.log(`Loading more games for page: ${nextPage}`);
    loadGames(nextPage);
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
      <Route path="/" element={<MainApp games={games} setGames={setGames} onLoadMore={handleLoadMore} resetSearchQuery={resetSearchQuery} />} />
      <Route path="/game/:id" element={<GameDetails games={games} />} />
    </Routes>
  );
};

export default App;