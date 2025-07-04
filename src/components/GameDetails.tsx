import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Game } from '../types/game';
import '../App.scss';
import '../GameDetail.scss';
import '../GameCard.scss';

//GameDetails component that handles props and states for game details
interface GameDetailsProps {
  games: Game[];
}

//Components for game detail page
const GameDetails: React.FC<GameDetailsProps> = ({ games }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  console.log('Games in GameDetails:', games);
  console.log('Game ID from URL:', id);
  const game = games.find(g => g.id === Number(id));
  console.log('Found game:', game);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            {game.rating && (
              <div className="rating">Rating: {game.rating.toFixed(1)}</div>
            )}
            <div className="release-date">Release: {formatDate(game.releaseDate)}</div>
            
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