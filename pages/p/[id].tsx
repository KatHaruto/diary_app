import {
  Avatar,
  Box,
  HStack,
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
import Router from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";
import Image from "next/image";
import { ConvertToYearMonDay } from "../../lib/utils";

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
  await fetch(`https://diary-app-six.vercel.app/api/publish/${id}`, {
    method: "PUT",
  });

  await Router.push("/");
}

async function deletePost(id: number): Promise<void> {
  await fetch(`https://diary-app-six.vercel.app/api/post/${id}`, {
    method: "DELETE",
  });
  Router.back();
}

const PostContents: React.FC<{
  post: PostProps;
  userHasValidSession: boolean;
  postBelongsToUser: boolean;
}> = ({ post, userHasValidSession, postBelongsToUser }) => {
  return (
    <Box maxW={["300px", "500px"]} minW={["300px", "500px"]}>
      <Text fontWeight="semibold" fontSize="24px">
        {post.title + (post.published ? "" : "(下書き)")}
      </Text>
      <Box minH={["50px", "50px", "50px", "415px"]} overflowWrap="break-word">
        <Text whiteSpace="pre-wrap">
          {"\n"}
          {post.content}
        </Text>
      </Box>
      <Flex>
        <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
          <Avatar size={"sm"} src={post.author.image} />
          <Text>
            {post.author.name + " - " + ConvertToYearMonDay(post.createdAt)}
          </Text>
        </HStack>
        <Spacer />
        {!post.published && userHasValidSession && postBelongsToUser && (
          <Button onClick={() => publishPost(post.id)}>Publish</Button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <Button onClick={() => deletePost(post.id)}>Delete</Button>
        )}
      </Flex>
    </Box>
  );
};

const PostSong: React.FC<{ post: PostProps }> = ({ post }) => {
  return (
    <VStack spacing={4} align="center">
      <Box
        position="relative"
        width={["200px", "400px"]}
        height={["200px", "400px"]}
      >
        <Image layout="fill" src={post.music.imageUrl} alt="No ArtWork" />
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
        {post.music.artistName} / {post.music.songName}
      </Box>

      <iframe
        src={"https://open.spotify.com/embed/track/" + post.music.songId}
        width="90%"
        height="80px"
      ></iframe>
      <iframe
        width="94%"
        height="52"
        src={
          "https://embed.odesli.co/?" +
          new URLSearchParams({
            url: "spotify:" + "track:" + post.music.songId,
            theme: "light",
          }).toString()
        }
        frameBorder="0"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </VStack>
  );
};
const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const [session, loading] = useSession();
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === post.author?.email;

  if (loading) {
    return <div>Authenticating ...</div>;
  }
  return (
    <Layout>
      <Wrap justify="center" mt="3%" spacing="10%">
        <WrapItem>
          <PostSong post={post} />
        </WrapItem>
        <WrapItem>
          <PostContents
            post={post}
            userHasValidSession={userHasValidSession}
            postBelongsToUser={postBelongsToUser}
          />
        </WrapItem>
      </Wrap>
    </Layout>
  );
};

export default Post;
