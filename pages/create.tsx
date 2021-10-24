/* eslint-disable react/display-name */
import React, { forwardRef, useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { Track } from "spotify-web-api-ts/types/types/SpotifyObjects";
import NotFoundImage from "./static/NotFoundImage.png";
import autosize from "autosize";
import {
  VStack,
  Box,
  Input,
  Flex,
  Button,
  Textarea,
  Switch,
  FormControl,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";
import TrackCard from "../components/TrackCard";
import { useCallback } from "react";
import useSearchTracksApi from "../lib/hook/useSearchTracksAPI";
import { SearchSong, SearchSongResult } from "../lib/spotifySearch";

type InputDiaryFormProps = {
  submitData: (e: React.SyntheticEvent) => Promise<void>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  published: boolean;
  setPublished: React.Dispatch<React.SetStateAction<boolean>>;
  music: Track;
  submit: boolean;
};

type InputDiaryProps = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

type SubmitMenuProps = {
  published: boolean;
  setPublished: React.Dispatch<React.SetStateAction<boolean>>;
  toBeDisabled: boolean;
  submit: boolean;
};

const InputDiary = forwardRef<HTMLTextAreaElement, InputDiaryProps>(
  ({ title, setTitle, setContent }, ref) => {
    return (
      <>
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
      </>
    );
  }
);
// eslint-disable-next-line react/display-name
const InputDiaryForm = forwardRef<HTMLTextAreaElement, InputDiaryFormProps>(
  (
    {
      submitData,
      title,
      setTitle,
      setContent,
      published,
      setPublished,
      content,
      music,
      submit,
    },
    ref
  ) => {
    const [toBeDisabled, setToBeDisabled] = useState<boolean>(false);
    useEffect(() => {
      setToBeDisabled(!title || !content || !music || submit);
    }, [title, content, music, submit]);
    return (
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
              <InputDiary
                title={title}
                setTitle={setTitle}
                ref={ref}
                setContent={setContent}
              />
              <SubmitMenu
                published={published}
                submit={submit}
                setPublished={setPublished}
                toBeDisabled={toBeDisabled}
              />
            </VStack>
          </Box>
        </form>
      </Box>
    );
  }
);

const SubmitMenu: React.FC<SubmitMenuProps> = ({
  published,
  setPublished,
  submit,
  toBeDisabled,
}) => {
  return (
    <Flex>
      <FormControl display="flex" alignItems="center">
        <FormLabel id="is_published" htmlFor="is_published" mb="0">
          <Box
            fontSize="sm"
            fontWeight="semibold"
            opacity={published ? 1 : 0.5}
          >
            公開する
          </Box>
        </FormLabel>
        <Switch
          id="is_published"
          onChange={() => {
            setPublished((v) => !v);
          }}
        />
      </FormControl>
      <Button
        disabled={toBeDisabled}
        colorScheme="teal"
        type="submit"
        minW="130px"
        mx="3"
      >
        {published ? "公開" : "下書き保存"}
      </Button>
      {submit && (
        <Spinner
          mx="2"
          mt="2"
          p="2"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.400"
          size="sm"
        />
      )}
    </Flex>
  );
};
const Draft: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [published, setPublished] = useState<boolean>(false);
  const [music, setMusic] = useState<Track>(null);
  const [isMarkDown, setIsMarkDown] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  const processing = useRef(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const {
    data: searchResults,
    isValidating: searchLoading,
    mutate: searchMutate,
  } = useSearchTracksApi({ searchWord });

  useEffect(() => {
    searchMutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord]);
  const submitData = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();

      if (processing.current) return;
      try {
        processing.current = true;
        setSubmit(true);

        const song = {
          id: music.id,
          name: music.name,
          album: { id: music.album.id, name: music.album.name },
          artists: {
            id: music.artists.map((a) => a.id),
            name: music.artists.map((a) => a.name),
          },
          image_url: music.album.images.length
            ? music.album.images[0].url
            : NotFoundImage.src,
          spotify_url: music.external_urls.spotify,
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
    },
    [title, content, isMarkDown, published, music]
  ); //processing variable only changes in this function.

  const handleBeforeUnload = useCallback((e) => {
    e.preventDefault();
    const message =
      "Are you sure you want to leave? All provided data will be lost.";
    e.returnValue = message;
    return message;
  }, []);
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    autosize(ref.current);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      autosize.destroy(ref.current);
    };
  }, [handleBeforeUnload]);

  return (
    <Layout>
      <VStack justify="center" mt="3%" spacing={["0%", "10%"]}>
        <VStack width={["200px", "400px"]}>
          <SearchSong searchWord={searchWord} setSearchWord={setSearchWord} />

          <SearchSongResult
            music={music}
            setMusic={setMusic}
            searchResults={searchResults}
          />
        </VStack>

        <InputDiaryForm
          submitData={submitData}
          title={title}
          setTitle={setTitle}
          ref={ref}
          setContent={setContent}
          published={published}
          setPublished={setPublished}
          content={content}
          music={music}
          submit={submit}
        />
      </VStack>
    </Layout>
  );
};

export default Draft;
