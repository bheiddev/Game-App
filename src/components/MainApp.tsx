import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.scss';
import { Game } from '../types/game';
import '../GameGrid.scss';

interface MainAppProps {
  games: Game[];
}

//MainApp component that handles props and states for games grid and search
const MainApp: React.FC<MainAppProps> = ({ games }) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  //when the user clicks a game it navigates to the game details page using game id
  const handleGameClick = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };

  //formats date to readable format
  const formatDate = (dateString: string) => {
    console.log('Raw date string:', dateString);
    try {
      const date = new Date(dateString);
      console.log('Formatted date:', date);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

//MainApp components
  return (
    <div className="main-app">
      <div className="header">
        <h1>Best New Indie Games</h1>
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>
      <div className="games-grid">
        {filteredGames.map((game) => {
          console.log('Game data:', game);
          return (
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
          );
        })}
      </div>
    </div>
  );
};

export default MainApp; 