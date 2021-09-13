import { Box, Badge, Spacer, Avatar, HStack, Text } from "@chakra-ui/react";
import Link from "../lib/Link";
import React from "react";
import Image from "next/image";
import { PostProps } from "./Post";
import { calcHowLongAgo } from "../lib/utils";

const DesktopPost: React.FC<{ post: PostProps }> = ({ post }) => {
  return (
    <Box maxW="250px" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box position="relative" width="250px" height="250px" cursor="pointer">
        <Link href={`/p/${encodeURIComponent(post.id)}`}>
          <a>
            <Image layout="fill" src={post.music.imageUrl} alt="No ArtWork" />
          </a>
        </Link>
      </Box>
      <Box px="6" py="3">
        <Box fontWeight="semibold" as="h4" isTruncated>
          {post.title}
        </Box>

        <Box
          mt="1"
          color="gray.500"
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
          isTruncated
        >
          {post.music.songName} / {post.music.artistName[0]}
        </Box>

        <Box d="flex" mt="2" align-items="center">
          {post.published ? (
            <HStack
              marginTop="1"
              spacing="2"
              display="flex"
              alignItems="center"
            >
              <Avatar size={"xs"} src={post.author.image} />
              <Text fontSize="xs">{post.author.name}</Text>
            </HStack>
          ) : (
            <Badge borderRadius="full" px="5px" py="3px" colorScheme="twitter">
              {" "}
              {"未公開"}{" "}
            </Badge>
          )}
          <Spacer />
          <Box mt="1" as="span" color="gray.600" fontSize="sm">
            {calcHowLongAgo(post.createdAt)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DesktopPost;
