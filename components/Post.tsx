import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Badge,
  Box,
  Link as CLink,
  Text,
  Image as CImage,
  Spacer,
} from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  music: {
    songId: string;
    songName: string;
    artistId: string[];
    artistName: string[];
    imageUrl: string;
    spotifyUrl: string;
  };
  content: string;
  published: boolean;
  createdAt: string;
};

const calcHowLongAgo = (dateString: string) => {
  const now = new Date();
  now.setHours(now.getHours() + 9);
  const diff = now.getTime() - new Date(dateString).getTime();
  if (Math.floor(diff / (1000 * 60 * 60 * 24 * 365)) >= 1) {
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365)) + "年前";
  }
  if (Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) >= 1) {
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) + "ヶ月前";
  }
  if (Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) >= 1) {
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + "週間前";
  }
  if (Math.floor(diff / (1000 * 60 * 60 * 24)) >= 1) {
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + "日前";
  }
  if (Math.floor(diff / (1000 * 60 * 60)) >= 1) {
    return Math.floor(diff / (1000 * 60 * 60)) + "時間前";
  }
  if (Math.floor(diff / (1000 * 60)) >= 1) {
    return Math.floor(diff / (1000 * 60)) + "分前";
  }

  return "今";
};
const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  return (
    <Box maxW="250px" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box cursor="pointer">
        <Link href={`/p/${encodeURIComponent(post.id)}`}>
          <Image width="250px" height="250px" src={post.music.imageUrl} />
        </Link>
      </Box>
      <Box p="6">
        <Box d="flex" alignItems="baseline">
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            isTruncated
          >
            {post.music.songName} / {post.music.artistName[0]}
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {post.title}
        </Box>

        <Box d="flex" mt="2" align-items="center">
          {post.published ? (
            ""
          ) : (
            <Badge borderRadius="full" px="5px" py="3px" colorScheme="twitter">
              {" "}
              {"未公開"}{" "}
            </Badge>
          )}
          <Spacer />
          <Box as="span" color="gray.600" fontSize="sm">
            {calcHowLongAgo(post.createdAt)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Post;
