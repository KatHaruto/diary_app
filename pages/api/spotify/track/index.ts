import { SpotifyWebApi } from "spotify-web-api-ts";


export default async function handler(req,res){
  const spotifyAPI = new SpotifyWebApi({ 
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:3000/api/authorize",
  });
  const access_token = (await spotifyAPI.getTemporaryAppTokens()).access_token
  spotifyAPI.setAccessToken(access_token);

  const { word } = req.query;

  const result = (await spotifyAPI.search.searchTracks(word));
  res.json(result.items);
}