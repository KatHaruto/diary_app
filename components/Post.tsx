import React from "react";
import Router from "next/router";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Box, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  music: {
    songName:string;
    artistName:string[];
    imageUrl:string;
    spotifyUrl:string;
  };
  content: string;
  published: boolean;
  createdAt: string;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  //const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <Box boxShadow="md" rounded="base" >
      <Box  onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
        <Image src={post.music.imageUrl} width={100} height={100}/>
        <h2>{post.title}</h2>
        <ReactMarkdown children={post.content} />
        {!post.published ? "下書き" : ""}
      </Box>
      <Link color="teal.500" onClick={() =>{}} href={post.music.spotifyUrl} target="_blank">Open Spotify<ExternalLinkIcon mx="2px" /></Link>
    </Box>
  );
};

export default Post;
