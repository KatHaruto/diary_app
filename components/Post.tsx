import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Badge,
  Box,
  Link as CLink,
  Text,
  Image as CImage,
  Spacer,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { forwardRef } from "react";
import DesktopPost from "./DesktopPost";
import MobilePost from "./MobilePosts";
export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
    image: string;
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
  isMarkDown: boolean;
  createdAt: string;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  if (isMobile) {
    return <MobilePost post={post} />;
  }
  return <DesktopPost post={post} />;
};

export default Post;
