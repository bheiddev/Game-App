import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.scss';
import { Game } from '../types/game';
import '../GameGrid.scss';
import { fetchTopRatedGames } from '../services/api';
import { fetchUpcomingGames } from '../services/api';
import Carousel from './Carousel';
import logo from '../images/logo.png';

const GAMES_PER_PAGE = 36;
export { GAMES_PER_PAGE };

//MainApp component that handles fetching and displaying games grid and search
const MainApp: React.FC<{ 
  games: Game[], 
  setGames: React.Dispatch<React.SetStateAction<Game[]>>, 
  onLoadMore: () => void, 
  resetSearchQuery: () => void,
  page: number 
}> = ({ games, setGames, onLoadMore, resetSearchQuery, page }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [releasedGames, setReleasedGames] = useState<Game[]>([]);

  const loadUpcomingGames = async (pageNum: number) => {
    console.log(`Loading upcoming games for page: ${pageNum}`);
    setLoading(true);
    try {
      const upcomingGames = await fetchUpcomingGames(pageNum * GAMES_PER_PAGE, GAMES_PER_PAGE);
      console.log('Upcoming games loaded:', upcomingGames);
      
      // Update main games state for game details access
      setGames((prev: Game[]) => {
        const existingIds = new Set(prev.map((game: Game) => game.id));
        const uniqueUpcomingGames = upcomingGames.filter((game: Game) => !existingIds.has(game.id));
        const updatedGames = [...prev, ...uniqueUpcomingGames];
        console.log('Updated games list with upcoming games:', updatedGames);
        return updatedGames;
      });
      
      // Also update upcomingGames state for carousel display
      setUpcomingGames(upcomingGames);
      
      setHasMore(upcomingGames.length === GAMES_PER_PAGE);
    } catch (error) {
      console.error('Failed to load upcoming games:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  const loadGames = async (pageNum: number) => {
    console.log(`Loading games for page: ${pageNum}`);
    setLoading(true);
    try {
        const newGames = await fetchTopRatedGames(pageNum * GAMES_PER_PAGE, GAMES_PER_PAGE);
        console.log('New games loaded:', newGames);
        
        // Update main games state for game details access
        setGames((prev: Game[]) => {
          const existingIds = new Set(prev.map((game: Game) => game.id));
          const uniqueNewGames = newGames.filter((game: Game) => !existingIds.has(game.id));
          const updatedGames = [...prev, ...uniqueNewGames];
          console.log('Updated games list:', updatedGames);
          return updatedGames;
        });
        
        // Update released games state for grid display
        setReleasedGames((prev: Game[]) => {
          const existingIds = new Set(prev.map((game: Game) => game.id));
          const uniqueNewGames = newGames.filter((game: Game) => !existingIds.has(game.id));
          const updatedGames = [...prev, ...uniqueNewGames];
          return updatedGames;
        });
        
      setHasMore(newGames.length === GAMES_PER_PAGE);
    } catch (error) {
      console.error('Failed to load games:', error);
      setHasMore(false);
      // Display an error message to the user if needed
      // This could be enhanced to show a UI error notification
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (page === 0) {
        // First load upcoming games for carousel
        await loadUpcomingGames(0);
        
        // Then load games for the grid
        await loadGames(0);
      } else {
        // Load more games when page changes
        await loadGames(page);
      }
    };
    
    loadData();
  }, [page]);

  const filteredGames = releasedGames.filter((game: Game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredUpcomingGames = upcomingGames.filter((game: Game) => {
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

  const handleLoadMoreAndClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    resetSearchQuery();
    onLoadMore();
  };

  return (
    <div className="main-app">
      <div className="header">
        <div className="header-content">
          <div className="logo-container">
            <h1>Indie Radar</h1>
            <img src={logo} alt="Indie Radar Logo" className="header-logo" />
          </div>
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
      </div>
  
      <div className="body-styles">
      {loading && <p>Loading games...</p>}
        {(!searchQuery || filteredUpcomingGames.length > 0) && (
          <>
            <h2 className="section-heading">Most Anticipated</h2>
            <Carousel games={filteredUpcomingGames} />
          </>
        )}
  
        {(!searchQuery || filteredGames.length > 0) && (
          <div>
            <h2 className="section-heading">New Releases</h2>
          </div>
        )}
  
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
            <button className="load-more-btn" onClick={handleLoadMoreAndClearSearch}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainApp; 