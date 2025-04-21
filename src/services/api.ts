import { Game, OAuthResponse } from '../types/game';

const API_BASE_URL = 'https://game-backend-7ga1.onrender.com/api';

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

export const initiateOAuthFlow = (): void => {
  const clientId = process.env.REACT_APP_IGDB_CLIENT_ID;
  const redirectUri = 'https://game-backend-7ga1.onrender.com';
  const scope = 'user:read:email'; // Add any required scopes

  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  window.location.href = authUrl;
};

export const handleOAuthCallback = async (): Promise<OAuthResponse> => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const error = params.get('error');
  const errorDescription = params.get('error_description');

  if (error) {
    throw new Error(`OAuth Error: ${errorDescription || error}`);
  }

  if (!code) {
    throw new Error('No authorization code received');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to exchange code for token: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in handleOAuthCallback:', error);
    throw error;
  }
}; 