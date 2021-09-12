import {
  Avatar,
  Box,
  HStack,
  Link as CLink,
  Spacer,
  StackDivider,
  VStack,
  Wrap,
  WrapItem,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/client";
import NextLink from "next/link";
import Router, { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";

import { Image as CImage } from "@chakra-ui/image";
import Image from "next/image";
import { destroy } from "autosize";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true, image: true },
      },
      music: {
        select: {
          songId: true,
          songName: true,
          artistID: true,
          artistName: true,
          imageUrl: true,
          spotifyUrl: true,
        },
      },
    },
  });
  if (post !== null) {
    post = JSON.parse(JSON.stringify(post));
    return {
      props: post,
    };
  } else {
    return {
      props: {},
    };
  }
};

async function publishPost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/publish/${id}`, {
    method: "PUT",
  });

  await Router.push("/");
}

async function deletePost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/post/${id}`, {
    method: "DELETE",
  });
  Router.back();
  //await Router.push("/");
}

const ConvertToYearMonDay = (d: string) => {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = ("00" + (date.getMonth() + 1)).slice(-2);
  const da = ("00" + date.getDate()).slice(-2);
  return y + "/" + m + "/" + da;
};

const Post: React.FC<PostProps> = (props) => {
  const [session, loading] = useSession();
  if (loading) {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (下書き)`;
  }
  return (
    <Layout>
      <Wrap justify="center" mt="3%" spacing="10%">
        <WrapItem>
          <VStack spacing={4} align="center">
            <Box
              position="relative"
              width={["200px", "400px"]}
              height={["200px", "400px"]}
            >
              <Image
                layout="fill"
                src={props.music.imageUrl}
                alt="No ArtWork"
              />
            </Box>
            <StackDivider borderColor="gray.200" />
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              isTruncated
            >
              {props.music.artistName} / {props.music.songName}
            </Box>
            <iframe
              width="100%"
              height="30%"
              src={
                "https://embed.odesli.co/?" +
                new URLSearchParams({
                  url: props.music.songId,
                  theme: "light",
                }).toString()
              }
            ></iframe>
            <iframe
              src={"https://open.spotify.com/embed/track/" + props.music.songId}
              width="90%"
              height="80px"
            ></iframe>
          </VStack>
        </WrapItem>
        <WrapItem>
          <VStack>
            <Box maxW={["300px", "500px"]} minW={["300px", "500px"]}>
              <Text fontWeight="semibold" fontSize="24px">
                {props.title}
              </Text>
              <Box
                minH={["50px", "50px", "50px", "415px"]}
                overflowWrap="break-word"
              >
                {props.isMarkDown ? (
                  <ReactMarkdown>{props.content}</ReactMarkdown>
                ) : (
                  <Text whiteSpace="pre-wrap">{props.content}</Text>
                )}
              </Box>
              <Flex>
                <HStack
                  marginTop="2"
                  spacing="2"
                  display="flex"
                  alignItems="center"
                >
                  <Avatar size={"sm"} src={props.author.image} />
                  <Text>
                    {props.author.name +
                      " - " +
                      ConvertToYearMonDay(props.createdAt)}
                  </Text>
                </HStack>
                <Spacer />
                {!props.published &&
                  userHasValidSession &&
                  postBelongsToUser && (
                    <Button onClick={() => publishPost(props.id)}>
                      Publish
                    </Button>
                  )}
                {userHasValidSession && postBelongsToUser && (
                  <Button onClick={() => deletePost(props.id)}>Delete</Button>
                )}
              </Flex>
            </Box>
          </VStack>
        </WrapItem>
      </Wrap>
    </Layout>
  );
};

export default Post;
