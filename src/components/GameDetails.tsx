import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Game } from '../types/game';
import '../App.scss';

interface GameDetailsProps {
  games: Game[];
}

const GameDetails: React.FC<GameDetailsProps> = ({ games }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = games.find(g => g.id === Number(id));

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
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

  if (!game) {
    return <div className="game-details">Game not found</div>;
  }

  console.log('Game details data:', game);

  return (
    <div className="game-details">
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back to Games
      </button>
      <div className="game-details-content">
        <div className="game-header">
          <img 
            src={game.coverUrl} 
            alt={game.name} 
            className="game-cover-large"
          />
          <div className="game-header-info">
            <h1>{game.name}</h1>
            <div className="rating">Rating: {game.rating?.toFixed(1) || 'N/A'}</div>
            <div className="release-date">Released: {formatDate(game.releaseDate)}</div>
            
            <div className="game-summary-full">
              {game.summary}
            </div>

            <div className="info-block">
              <h2>Genres</h2>
              <div className="tags">
                {game.genres?.map((genre) => (
                  <span key={genre} className="tag">{genre}</span>
                ))}
              </div>
            </div>

            <div className="info-block">
              <h2>Platforms</h2>
              <div className="tags">
                {game.platforms?.map((platform) => (
                  <span key={platform} className="tag">{platform}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails; 