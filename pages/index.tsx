import type { GetStaticProps } from "next";
import prisma from "../lib/prisma";
import Post, { PostProps } from "../components/Post";
import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  Wrap,
  WrapItem,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

export const getStaticProps: GetStaticProps = async () => {
  let feed = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: { published: true },
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
  feed = JSON.parse(JSON.stringify(feed));

  return { props: { feed }, revalidate: 10 };
};

type sortType = {
  key: string;
  order: number;
};

const Blog: React.FC<{ feed: PostProps[] }> = (props) => {
  const [sort, setSort] = useState<sortType>({ key: "", order: 0 });

  useMemo(() => {
    let tmp_feed = props.feed;
    if (sort.key) {
      tmp_feed = tmp_feed.sort((a, b) => {
        const d1 = Date.parse(a[sort.key]);
        const d2 = Date.parse(b[sort.key]);
        return (d1 === d2 ? 0 : d1 > d2 ? 1 : -1) * sort.order;
      });
    }
    return tmp_feed;
  }, [sort]);

  const handlesort = (column: string, order: number) => {
    setSort({
      key: column,
      order: order,
    });
  };
  //<Menu  isLazy id=<hoge>>
  //Menu is explicitly needed to set id
  return (
    <Layout>
      <Flex>
        <Flex
          justify="center"
          m="3%"
          fontWeight="semibold"
          fontSize={["20px", "28px"]}
        >
          Public Posts
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
        {props.feed.map((post) => (
          <WrapItem key={post.id} overflow="hidden">
            <Post post={post} />
          </WrapItem>
        ))}
      </Wrap>
    </Layout>
  );
};

export default Blog;
