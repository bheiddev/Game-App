import React from 'react';
import { Game } from '../types/game';
import { useNavigate } from 'react-router-dom';
import '../Carousel.scss';

interface CarouselProps {
  games: Game[];
}

const Carousel: React.FC<CarouselProps> = ({ games }) => {
  const navigate = useNavigate();

  const handleGameClick = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="carousel">
      {games.map((game, index) => (
        <div key={index} className="carousel-item" onClick={() => handleGameClick(game.id)} role="button" tabIndex={0}>
          {game.coverUrl && (
            <img src={game.coverUrl} alt={game.name} className="carousel-image" />
          )}
          <div className="carousel-info">
            <h3>{game.name}</h3>
            {game.releaseDate && <p>Release Date: {new Date(game.releaseDate).toLocaleDateString()}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel; 