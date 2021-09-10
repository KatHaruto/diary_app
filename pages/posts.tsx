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
const posts: React.FC<{ posts: PostProps[] }> = (props) => {
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

  const handlesort = (column: string) => {
    if (sort.key === column) {
      setSort({ ...sort, order: -sort.order });
    } else {
      setSort({
        key: column,
        order: 1,
      });
    }
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
      <Table size="md">
        <Thead>
          <Tr>
            <Th onClick={() => handlesort("createdAt")}>
              Created{sort.order > 0 ? " ▲" : " ▼"}
            </Th>
          </Tr>
        </Thead>
      </Table>

      <Text fontSize="lg">My Posts</Text>
      <Wrap mx="10%" spacing="10%" justify="center">
        {props.posts.map((post) => (
          <WrapItem key={post.id} overflow="hidden">
            <Post post={post} />
          </WrapItem>
        ))}
      </Wrap>
    </Layout>
  );
};

export default posts;
