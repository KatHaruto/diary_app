import {
  Box,
  HStack,
  Link as CLink,
  Spacer,
  StackDivider,
  VStack,
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true },
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

const Post: React.FC<PostProps> = (props) => {
  const [session, loading] = useSession();
  if (loading) {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <HStack spacing="24px" mt="10%">
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="center"
          mx="10%"
        >
          <Box>
            <Image width="400px" height="400px" src={props.music.imageUrl} />
          </Box>
          <Box></Box>

          <iframe
            width="100%"
            height="150"
            src={`https://embed.odesli.co/?url=spotify:track:${props.music.songId}&theme=light`}
            frameBorder="0"
            allowTransparency
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </VStack>
        <VStack>
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {props.title}
          </Box>
          <Box d="flex" alignItems="baseline">
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              isTruncated
            >
              {props.music.songName} / {props.music.artistName[0]}
            </Box>
          </Box>

          <Box d="flex" mt="2" align-items="center">
            <Spacer />
            <Box as="span" color="gray.600" fontSize="sm">
              {props.createdAt}
            </Box>
          </Box>
          <Box>
            <p>By {props?.author?.name || "Unknown author"}</p>
            <ReactMarkdown children={props.content} />
            {!props.published && userHasValidSession && postBelongsToUser && (
              <button onClick={() => publishPost(props.id)}>Publish</button>
            )}
            {userHasValidSession && postBelongsToUser && (
              <button onClick={() => deletePost(props.id)}>Delete</button>
            )}
          </Box>
        </VStack>
      </HStack>
    </Layout>
  );
};

export default Post;
