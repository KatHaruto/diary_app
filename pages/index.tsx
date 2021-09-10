import type { GetStaticProps, NextPage } from "next";
import prisma from "../lib/prisma";
import Post, { PostProps } from "../components/Post";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import Layout from "../components/Layout";
import {
  Table,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Wrap,
  WrapItem,
  Link as CLink,
  Box,
  Flex,
  HStack,
  IconButton,
  Select,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  Heading,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

export const getStaticProps: GetStaticProps = async () => {
  let feed = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: { published: true },
    include: {
      author: {
        select: { name: true },
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

  const Links = ["Feeds", "MyPost"];
  const NavLink = ({ children }: { children: ReactNode }) => (
    <NextLink href={"#"}>
      <CLink
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
      >
        {children}
      </CLink>
    </NextLink>
  );

  return (
    <Layout>
      <Flex>
        <Menu>
          <MenuButton color="black">
            {sort.order > 0 ? "Oldest" : "Latest"}
          </MenuButton>
          <MenuList>
            <MenuOptionGroup defaultValue="latest" type="radio">
              <MenuItemOption
                value="latest"
                onClick={() => handlesort("createdAt", -1)}
              >
                Latest
              </MenuItemOption>
              <MenuItemOption
                value="oldest"
                onClick={() => handlesort("createdAt", 1)}
              >
                Oldest
              </MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Flex>
      <Wrap mx="10%" spacing="10%" justify="center">
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
