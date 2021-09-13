import { Box, Badge, Spacer, Flex } from "@chakra-ui/react";
import Link from "../lib/Link";
import React from "react";
import Image from "next/image";
import { PostProps } from "./Post";
import { calcHowLongAgo } from "../lib/utils";
/**
 * 
    );
 */

const MobilePost: React.FC<{ post: PostProps }> = ({ post }) => {
  // TODO! set a link to apple music from mobile by using songlink api!
  return (
    <Flex key={post.id} m="1">
      <Box position="relative" height="60px" width="60px">
        <Link href={`/p/${encodeURIComponent(post.id)}`}>
          <a>
            <Image layout="fill" src={post.music.imageUrl} alt="No ArtWork" />
          </a>
        </Link>
      </Box>
      <Box px="6">
        <Box fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
          {post.title}
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
            {post.music.songName} / {post.music.artistName[0]}
          </Box>
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
    </Flex>
  );
};

export default MobilePost;

/*
<Box
      maxW={["150px", "250px"]}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Box
        position="relative"
        width={["150px", "250px"]}
        height={["150px", "250px"]}
        cursor="pointer"
      >
        <Link href={`/p/${encodeURIComponent(post.id)}`}>
          <a>
            <Image layout="fill" src={post.music.imageUrl} alt="No ArtWork" />
          </a>
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
    </Box>*/
