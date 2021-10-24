import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import React from "react";
import { Track } from "spotify-web-api-ts/types/types/SpotifyObjects";
import TrackCard from "../components/TrackCard";

type SearchSongProps = {
  searchWord: string;
  setSearchWord: React.Dispatch<React.SetStateAction<string>>;
};
type SearchSongResultProps = {
  music: Track;
  setMusic: React.Dispatch<React.SetStateAction<Track>>;
  searchResults: Track[];
};

export const SearchSong: React.FC<SearchSongProps> = ({
  searchWord,
  setSearchWord,
}) => {
  return (
    <Box position="relative" minW={["240px", "400px"]}>
      <Input
        value={searchWord}
        onChange={(e) => {
          setSearchWord(e.target.value);
        }}
        placeholder="search"
      />
    </Box>
  );
};

export const SearchSongResult: React.FC<SearchSongResultProps> = ({
  music,
  setMusic,
  searchResults,
}) => {
  return (
    <Box maxW={["300px", "400px"]} maxH="500px" overflow="scroll">
      {music ? (
        <Box>
          <TrackCard key={music.id} track={music} />
          <Button
            onClick={() => {
              setMusic(null);
            }}
          >
            cancel
          </Button>
        </Box>
      ) : (
        searchResults &&
        searchResults.map((r: Track) => (
          <Box
            key={r.id}
            onClick={() => {
              setMusic(r);
            }}
          >
            <TrackCard track={r} />
          </Box>
        ))
      )}
    </Box>
  );
};
