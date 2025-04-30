import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.scss';
import { Game } from '../types/game';
import '../GameGrid.scss';
import { fetchTopRatedGames } from '../services/api';

const GAMES_PER_PAGE = 36;
export { GAMES_PER_PAGE };

//MainApp component that handles fetching and displaying games grid and search
const MainApp: React.FC<{ games: Game[], setGames: React.Dispatch<React.SetStateAction<Game[]>>, onLoadMore: () => void, resetSearchQuery: () => void }> = ({ games, setGames, onLoadMore, resetSearchQuery }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const loadGames = async (pageNum: number) => {
    console.log(`Loading games for page: ${pageNum}`);
    setLoading(true);
    try {
      const newGames = await fetchTopRatedGames(pageNum * GAMES_PER_PAGE, GAMES_PER_PAGE);
      console.log('New games loaded:', newGames);
      setGames((prev: Game[]) => {
        const existingIds = new Set(prev.map((game: Game) => game.id));
        const uniqueNewGames = newGames.filter((game: Game) => !existingIds.has(game.id));
        const updatedGames = [...prev, ...uniqueNewGames];
        console.log('Updated games list:', updatedGames);
        return updatedGames;
      });
      setHasMore(newGames.length === GAMES_PER_PAGE);
    } catch (error) {
      console.error('Failed to load games:', error);
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGames(0);
  }, []);

  const filteredGames = games.filter((game: Game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  //when the user clicks a game it navigates to the game details page using game id
  const handleGameClick = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };

  //formats date to readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0) {
      const matches = games
        .map(game => game.name)
        .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5); // Limit to 5 suggestions
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="main-app">
      <div className="header">
        <h1>Best New Indie Games</h1>
        <div className="search-bar-container" style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="autocomplete-list">
              {suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="games-grid">
        {filteredGames.map((game: Game) => (
          <div 
            key={game.id} 
            className="game-card"
            onClick={() => handleGameClick(game.id)}
            role="button"
            tabIndex={0}
          >
            {game.coverUrl && (
              <img 
                src={game.coverUrl} 
                alt={game.name}
                className="game-cover"
              />
            )}
            <div className="game-info">
              <h2>{game.name}</h2>
              {game.rating && (
                <p className="rating">Rating: {game.rating.toFixed(1)}</p>
              )}
              {game.releaseDate && (
                <p className="release-date">Release Date: {formatDate(game.releaseDate)}</p>
              )}
              {game.summary && (
                <p className="game-summary">{game.summary}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {hasMore && !loading && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={onLoadMore}>
            Load More
          </button>
        </div>
      )}
      {loading && <p>Loading games...</p>}
    </div>
  );
};

export default MainApp; 