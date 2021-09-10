import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import Image from "next/image";
import { Track } from "spotify-web-api-ts/types/types/SpotifyObjects";
import NotFoundImage from "./static/NotFoundImage.png";
import { useBeforeUnload } from "react-use";
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
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

const Draft: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [published, setPublished] = useState<Boolean>(false);
  const [music, setMusic] = useState<Track>(null);

  const [searchWord, setSearchWord] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  useEffect(() => {
    const f = async () => {
      if (searchWord) {
        const res = await fetch(
          "./api/spotify/track?" +
            new URLSearchParams({
              word: searchWord,
            })
        )
          .then(async (res) => JSON.parse(await res.text()))
          .catch(() => console.log("search error "));

        setSearchResults(res);
      } else {
        setSearchResults([]);
      }
    };
    f();
  }, [searchWord]);

  const selectedmusicJSX = useMemo(() => {
    if (music) {
      return (
        <li key={music.id}>
          <Image
            height={100}
            width={100}
            src={music.album.images[0].url}
            onError={(e) => (e.currentTarget.src = NotFoundImage.src)}
          />
          {music.name}({music.artists[0].name})
          <div onClick={() => setMusic(null)}>cancel</div>
        </li>
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
        <Td>
          <Image
            src={src}
            height="300"
            width="300"
            onError={(e) => (e.currentTarget.src = NotFoundImage.src)}
          />
        </Td>
        <Td>
          <Text fontSize="sm">{r.name}</Text>
          <Text fontSize="xs">({r.artists[0].name + ": " + r.album.name})</Text>
        </Td>
      </Tr>
    );
  };
  const handleSelectMusic = (track: Track) => {
    setMusic(track);
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
      <Flex m="10%">
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={2}
          align="center"
          width="40%"
        >
          <Input
            type="text"
            value={searchWord}
            onChange={(e) => {
              setSearchWord(e.target.value);
            }}
            placeholder="search"
          />
          <Table>
            <Tbody>
              <Tr>
                <Td>{selectedmusicJSX}</Td>
              </Tr>
              {!selectedmusicJSX &&
                searchResults.map((r) => handleMapSearchResult(r))}
            </Tbody>
          </Table>
        </VStack>
        <Spacer />
        <form onSubmit={submitData}>
          <VStack>
            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              <h1>New Draft</h1>
            </Box>
            <Box>
              <input
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                type="text"
                value={title}
              />
            </Box>
            <Box>
              <textarea
                cols={50}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                rows={8}
                value={content}
              />
            </Box>
            <Box>
              <input
                disabled={!content || !title}
                type="submit"
                value="投稿"
                onClick={() => setPublished(true)}
              />
            </Box>
            <Box>
              <input
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
      </Flex>
    </Layout>
  );
};

export default Draft;
