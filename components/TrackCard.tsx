import { Flex, Box, Text } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";
import { convertMillisToMinutesAndSecret } from "../lib/utils";
import NotFoundImage from "../pages/static/NotFoundImage.png";
import { Track } from "spotify-web-api-ts/types/types/SpotifyObjects";

const TrackCard: React.FC<{ track: Track }> = ({ track }) => {
  const src = track.album.images.length
    ? track.album.images[0].url
    : NotFoundImage.src;
  return (
    <Flex m="1">
      <Box
        position="relative"
        height={["60px", "100px"]}
        width={["60px", "100px"]}
      >
        <Image
          src={src}
          alt="No ArtWork"
          layout={"fill"}
          onError={(e) => {
            e.currentTarget.src = NotFoundImage.src;
          }}
        />
      </Box>
      <Box
        minW={["180px", "300px"]}
        maxW={["180px", "300px"]}
        pl="3"
        isTruncated
        overflow="scroll"
      >
        <Text fontWeight="semibold" fontSize="sm">
          {track.name}
        </Text>
        <Text fontSize="xs">
          {track.artists[0].name + ": " + track.album.name}
        </Text>
        <Text fontSize="xs">
          {track.album.release_date + " "}
          {convertMillisToMinutesAndSecret(track.duration_ms)}
        </Text>
      </Box>
    </Flex>
  );
};

export default TrackCard;
