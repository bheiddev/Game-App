import { Game, OAuthResponse } from '../types/game';

const API_BASE_URL = 'https://game-backend-7ga1.onrender.com/api';

//Fetch top rated games and track progress per game
export const fetchTopRatedGames = async (
  onProgress?: (processed: number, total?: number) => void
): Promise<Game[]> => {
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

    // If using a streaming approach or if your backend supports progress events
    // you could call onProgress here multiple times as data comes in
    
    const data = await response.json();
    
    // Simulate processing progress (in a real app, you'd report actual progress)
    if (onProgress && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        // Process each game
        // In a real implementation, you might do some data transformation here
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate processing time
        onProgress(i + 1, data.length);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchTopRatedGames:', error);
    throw error;
  }
};