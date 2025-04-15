export interface Game {
  id: number;
  name: string;
  coverUrl?: string;
  rating?: number;
  releaseDate?: string;
  summary?: string;
  genres?: string[];
  platforms?: string[];
}

export interface OAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
} 