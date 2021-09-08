import { SpotifyWebApi } from "spotify-web-api-ts";

const spotifyAPI = new SpotifyWebApi({ 
  clientId: "c1fe119962fa44af9677a33943dd7415" || process.env.SPOTIFY_CLIENT_ID,
  clientSecret: "783cec78b91f498f9234c366307492b6" || process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/api/authorize",
});
const setAcsessToken =  async() => {
  const access_token = (await spotifyAPI.getTemporaryAppTokens()).access_token
  spotifyAPI.setAccessToken(access_token);
}
setAcsessToken();


export default spotifyAPI;

function access_token(access_token: any) {
  throw new Error("Function not implemented.");
}
