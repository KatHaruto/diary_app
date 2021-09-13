import React, { useEffect, useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import { useSession, getSession } from "next-auth/client";
import prisma from "../lib/prisma";
import {
  Flex,
  Table,
  Th,
  Thead,
  Tr,
  Text,
  SimpleGrid,
  Wrap,
  WrapItem,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { posts: [] } };
  }

  let posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      author: { email: session.user.email },
    },
    include: {
      author: {
        select: { name: true },
      },
      music: {
        select: {
          songName: true,
          artistName: true,
          imageUrl: true,
          spotifyUrl: true,
        },
      },
    },
  });

  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: { posts },
  };
};

type sortType = {
  key: string;
  order: number;
};
const Posts: React.FC<{ posts: PostProps[] }> = (props) => {
  const [session] = useSession();

  const [sort, setSort] = useState<sortType>({ key: "", order: 0 });

  useMemo(() => {
    let tmp_posts = props.posts;
    if (sort.key) {
      tmp_posts = tmp_posts.sort((a: PostProps, b: PostProps) => {
        const d1: number = Date.parse(a[sort.key]);
        const d2: number = Date.parse(b[sort.key]);
        return (d1 === d2 ? 0 : d1 > d2 ? 1 : -1) * sort.order;
      });
    }
    return tmp_posts;
  }, [sort]);

  const handlesort = (column: string, order: number) => {
    setSort({
      key: column,
      order: order,
    });
  };

  if (!session) {
    return (
      <Layout>
        <h1>My Posts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex>
        <Flex
          justify="center"
          m="3%"
          fontWeight="semibold"
          fontSize={["20px", "28px"]}
        >
          My Posts
        </Flex>
        <Menu isLazy id={"sort_menu_id"}>
          <MenuButton color="black" fontSize={["xs", "sm"]}>
            {sort.order > 0 ? "Oldest" : "Latest"}
          </MenuButton>
          <MenuList id="sort_list">
            <MenuItem
              value="latest"
              onClick={() => handlesort("createdAt", -1)}
            >
              Latest
            </MenuItem>
            <MenuItem value="oldest" onClick={() => handlesort("createdAt", 1)}>
              Oldest
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Wrap mx={["5%", "10%"]} spacing={["5%", "10%"]} justify="center">
        {props.posts.map((post) => (
          <WrapItem key={post.id} overflow="hidden">
            <Post post={post} />
          </WrapItem>
        ))}
      </Wrap>
    </Layout>
  );
};

export default Posts;
