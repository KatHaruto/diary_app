import React, { useEffect, useMemo, useRef, useState } from "react";
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
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

const Draft: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [published, setPublished] = useState<Boolean>(false);
  const [music, setMusic] = useState<Track>(null);

  const [searchWord, setSearchWord] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);

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
        <VStack>
          <Table>
            <Tbody>
              <Tr key={music.id}>
                <Td>
                  <Box position="relative" height="100px" width="100px">
                    <Image
                      layout="fill"
                      src={music.album.images[0].url}
                      onError={(e) => (e.currentTarget.src = NotFoundImage.src)}
                    />
                  </Box>
                </Td>
                <Td>
                  {music.name}({music.artists[0].name})
                </Td>
              </Tr>
            </Tbody>
          </Table>
          <Button onClick={() => setMusic(null)}>cancel</Button>
        </VStack>
      );
    }
  }, [music]);
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
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

      const body = { title, content, published, song };
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
    }
  };
  const handleMapSearchResult = (r: Track) => {
    const src = r.album.images.length
      ? r.album.images[0].url
      : NotFoundImage.src;

    return (
      <Tr onClick={() => handleSelectMusic(r)} key={r.id}>
        <Td px="3%">
          <Box position="relative" height="70px" width="70px">
            <Image
              src={src}
              layout={"fill"}
              onError={(e) => {
                e.currentTarget.src = NotFoundImage.src;
              }}
            />
          </Box>
        </Td>
        <Td>
          <Text fontWeight="semibold" fontSize="sm">
            {r.name}
          </Text>
          <Text fontSize="xs">{r.artists[0].name + ": " + r.album.name}</Text>
        </Td>
      </Tr>
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
      <Wrap spacing="20%" m="10%" justify="center">
        <WrapItem>
          <VStack divider={<StackDivider borderColor="gray.200" />} spacing={2}>
            <Box w="80%">
              <Input
                value={searchWord}
                onChange={(e) => {
                  setSearchWord(e.target.value);
                }}
                placeholder="search"
              />
              {selectedmusicJSX}

              <Table>
                <Tbody>
                  {!selectedmusicJSX &&
                    searchResults.map((r) => handleMapSearchResult(r))}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        </WrapItem>
        <WrapItem>
          <form onSubmit={submitData}>
            <VStack>
              <Box fontWeight="semibold" lineHeight="tight" isTruncated>
                New Draft
              </Box>
              <Box>
                <Input
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  variant="flushed"
                  value={title}
                />
              </Box>
              <Box>
                <Textarea
                  variant="flushed"
                  ref={ref}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="content"
                />
              </Box>
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
          </form>
        </WrapItem>
      </Wrap>
    </Layout>
  );
};

export default Draft;
