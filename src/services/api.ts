import { Game, OAuthResponse } from '../types/game';
import { GAMES_PER_PAGE } from '../components/MainApp';

const API_BASE_URL = 'https://game-backend-7ga1.onrender.com/api';

export const fetchTopRatedGames = async (
  offset: number = 0,
  limit: number = 36
): Promise<Game[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/igdb/top-rated?offset=${offset}&limit=${limit}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Backend API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchTopRatedGames:', error);
    throw error;
  }
};