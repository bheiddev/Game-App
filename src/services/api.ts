import { Game, OAuthResponse } from '../types/game';

const API_BASE_URL = 'https://game-backend-7ga1.onrender.com/api';

//call the backend API to pull in the games data
export const fetchTopRatedGames = async (): Promise<Game[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/igdb/top-rated`);
    
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

