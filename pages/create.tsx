import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import Image from "next/image";
import { Track } from "spotify-web-api-ts/types/types/SpotifyObjects";
import NotFoundImage from "./static/NotFoundImage.png";
import TextareaAutosize from "react-textarea-autosize";
import autosize from "autosize";
import {
  HStack,
  VStack,
  StackDivider,
  Box,
  Spacer,
  Input,
  Table,
  Th,
  Tr,
  Flex,
  Text,
  Td,
  Tbody,
  Button,
  WrapItem,
  Wrap,
  Textarea,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

const convertMillisToMinutesAndSecret = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Number(((millis % 60000) / 1000).toFixed(0));
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

const Draft: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [published, setPublished] = useState<Boolean>(false);
  const [music, setMusic] = useState<Track>(null);
  //const [isMarkDown, ToggleIsMarkDown] = useToggle();
  const [isMarkDown, setIsMarkDown] = useState(false);
  const [searchWord, setSearchWord] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const processing = useRef(false);

  const ref = useRef();

  useEffect(() => {
    (async () => {
      if (searchWord) {
        await fetch(
          "./api/spotify/track?" +
            new URLSearchParams({
              word: searchWord,
            })
        )
          .then(async (res) => {
            const r = JSON.parse(await res.text());
            setSearchResults(r);
          })
          .catch((err) => {
            setSearchResults([]);
          });
      } else {
        setSearchResults([]);
      }
    })();
  }, [searchWord]);

  const selectedmusicJSX = useMemo(() => {
    if (music) {
      return (
        <Box>
          <Flex onClick={() => handleSelectMusic(music)} key={music.id} m="1">
            <Box position="relative" height="100px" width="100px">
              <Image
                src={music.album.images[0].url}
                alt="No ArtWork"
                layout={"fill"}
                onError={(e) => {
                  e.currentTarget.src = NotFoundImage.src;
                }}
              />
            </Box>
            <Box pl="3" isTruncated width="300px">
              <Text fontWeight="semibold" fontSize="sm">
                {music.name}
              </Text>
              <Text fontSize="xs">
                {music.artists[0].name + ": " + music.album.name}
              </Text>
              <Text fontSize="xs">
                {music.album.release_date + " "}
                {convertMillisToMinutesAndSecret(music.duration_ms)}
              </Text>
            </Box>
          </Flex>
          <Button
            onClick={() => {
              setMusic(null);
            }}
          >
            cancel
          </Button>
        </Box>
      );
    }
  }, [music]);
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (processing.current) return;
    try {
      processing.current = true;

      const album = { id: music.album.id, name: music.album.name };
      const artists = {
        id: music.artists.map((a) => a.id),
        name: music.artists.map((a) => a.name),
      };
      const url = music.album.images.length
        ? music.album.images[0].url
        : NotFoundImage.src;
      const spotify_url = music.external_urls.spotify;
      const song = {
        id: music.id,
        name: music.name,
        album: album,
        artists: artists,
        image_url: url,
        spotify_url: spotify_url,
      };

      const body = { title, content, isMarkDown, published, song };
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (published) {
        await Router.push("/");
      } else {
        await Router.push("/posts");
      }
    } catch (error) {
      console.error(error);
    } finally {
      processing.current = false;
    }
  };
  const handleMapSearchResult = (r: Track) => {
    const src = r.album.images.length
      ? r.album.images[0].url
      : NotFoundImage.src;

    return (
      <Flex onClick={() => handleSelectMusic(r)} key={r.id} m="1">
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
          minW={["140px", "300px"]}
          maxW={["140px", "300px"]}
          pl="3"
          isTruncated
          overflow="scroll"
        >
          <Text fontWeight="semibold" fontSize="sm">
            {r.name}
          </Text>
          <Text fontSize="xs">{r.artists[0].name + ": " + r.album.name}</Text>
          <Text fontSize="xs">
            {r.album.release_date + " "}
            {convertMillisToMinutesAndSecret(r.duration_ms)}
          </Text>
        </Box>
      </Flex>
    );
  };
  const handleSelectMusic = (track: Track) => {
    setMusic(track);
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    autosize(ref.current);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      autosize.destroy(ref.current);
    };
  }, []);

  const handleBeforeUnload = (e) => {
    e.preventDefault();
    const message =
      "Are you sure you want to leave? All provided data will be lost.";
    e.returnValue = message;
    return message;
  };

  return (
    <Layout>
      <VStack justify="center" mt="3%" spacing={["0%", "10%"]}>
        <Box width={["200px", "400px"]}>
          <VStack>
            <Box position="relative" minW={["200px", "400px"]}>
              <Input
                value={searchWord}
                onChange={(e) => {
                  setSearchWord(e.target.value);
                }}
                placeholder="search"
              />
            </Box>
            <Box maxW={["300px", "400px"]} maxH="500px" overflow="scroll">
              {selectedmusicJSX}

              {!selectedmusicJSX &&
                searchResults.map((r) => handleMapSearchResult(r))}
            </Box>
          </VStack>
        </Box>
        <Box width={["350px", "400px", "500px", "600px"]}>
          <form onSubmit={submitData}>
            <Box mx="3%">
              <VStack spacing="10px">
                <Box
                  mr="auto"
                  ml="auto"
                  fontWeight="semibold"
                  lineHeight="tight"
                  isTruncated
                >
                  新しい投稿
                </Box>
                <Input
                  fontSize="xl"
                  fontWeight="semibold"
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  variant="flushed"
                  value={title}
                  cols={60}
                />

                <Textarea
                  variant="flushed"
                  ref={ref}
                  rows={10}
                  cols={60}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="content"
                  overflowWrap="break-word"
                />
                <Box>
                  <Input
                    disabled={!content || !title}
                    type="submit"
                    value="投稿"
                    onClick={() => setPublished(true)}
                  />
                </Box>
                <Box>
                  <Input
                    disabled={!content || !title}
                    type="submit"
                    value="下書き"
                  />
                  <a className="back" href="#" onClick={() => Router.back()}>
                    or Cancel
                  </a>
                </Box>
              </VStack>
            </Box>
          </form>
        </Box>
      </VStack>
    </Layout>
  );
};

export default Draft;
