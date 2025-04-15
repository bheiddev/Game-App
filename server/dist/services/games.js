"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopRatedGames = getTopRatedGames;
let accessToken = null;
let tokenExpiry = null;
async function getTwitchAccessToken() {
    const clientId = process.env.IGDB_CLIENT_ID;
    const clientSecret = process.env.IGDB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error('Client ID or Client Secret is not configured');
    }
    // Check if we have a valid token
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return accessToken;
    }
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to get access token');
    }
    const data = await response.json();
    accessToken = data.access_token;
    // Set expiry to 1 hour from now (minus 5 minutes buffer)
    tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
    if (!accessToken) {
        throw new Error('Access token is null after successful response');
    }
    return accessToken;
}
async function getTopRatedGames() {
    try {
        const token = await getTwitchAccessToken();
        const clientId = process.env.IGDB_CLIENT_ID;
        if (!clientId) {
            throw new Error('Client ID is not configured');
        }
        const response = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: `
        fields name, cover.url, rating, first_release_date, genres.name, platforms.name, summary;
        where genres = (32) & rating >= 85 & rating_count >= 100;
        sort rating desc;
        limit 25;
      `,
        });
        if (!response.ok) {
            throw new Error(`IGDB API error: ${response.statusText}`);
        }
        const games = await response.json();
        return games.map((game) => {
            var _a, _b, _c;
            return ({
                id: game.id,
                name: game.name,
                coverUrl: ((_a = game.cover) === null || _a === void 0 ? void 0 : _a.url) ? `https:${game.cover.url}` : null,
                rating: game.rating,
                releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
                genres: ((_b = game.genres) === null || _b === void 0 ? void 0 : _b.map((g) => g.name)) || [],
                platforms: ((_c = game.platforms) === null || _c === void 0 ? void 0 : _c.map((p) => p.name)) || [],
                summary: game.summary || '',
            });
        });
    }
    catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}
