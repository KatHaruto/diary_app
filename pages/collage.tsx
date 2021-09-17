import { Box, Flex, Wrap, WrapItem } from "@chakra-ui/layout";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import React, { useRef, useState } from "react";
import Layout from "../components/Layout";
import Image from "next/image";
import prisma from "../lib/prisma";

import { SortableContainer } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import CollageContaniner from "../components/collage/container";
import { Button, Grid } from "@chakra-ui/react";
import { createContext } from "react";

type IProps = {
  id: number;
  title: string;

  music: {
    imageUrl: string;
  };
  content: string;
  published: boolean;
  isMarkDown: boolean;
  createdAt: string;
};
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { posts: [] } };
  }
  let feed = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      author: { email: session.user.email },
    },
    include: {
      music: {
        select: {
          imageUrl: true,
        },
      },
    },
  });
  feed = JSON.parse(JSON.stringify(feed));

  return { props: { feed } };
};

export const CollageContext = createContext(null);

const Collage: React.FC<{ feed: IProps[] }> = (props) => {
  //<Menu  isLazy id=<hoge>>
  //Menu is explicitly needed to set id
  /*const [collages, setCollages] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]);*/

  const Collages = SortableContainer(CollageContaniner);
  const [imageNum, setImageNum] = useState(9);
  const [collages, setCollages] = useState(
    new Array(imageNum).fill(1).map((n, i) => {
      return { id: n + i, url: "" };
    })
  );
  const [selected, setSelected] = useState<IProps>(null);
  const onSortEnd = (e) => {
    const newCollages = arrayMoveImmutable(collages, e.oldIndex, e.newIndex);
    setCollages(newCollages);
  };
  const AddCollageItem = (id, url, ind) => {
    if (collages.map((c) => c.id).includes(id)) {
      return;
    }
    let new_collages = collages.slice(0, collages.length);
    new_collages[ind] = { id: id, url: url };
    setCollages(new_collages);
  };

  const DelCollageItem = (ind) => {
    let new_collages = collages.slice(0, collages.length);
    new_collages[ind] = { id: collages[ind].id, url: "" };
    setCollages(new_collages);
  };
  const value = {
    selected: selected,
    setSelected: setSelected,
    Add: AddCollageItem,
    Del: DelCollageItem,
  };

  return (
    <Layout>
      <Flex>
        <Flex
          justify="center"
          m="3%"
          fontWeight="semibold"
          fontSize={["20px", "28px"]}
        >
          Collage
        </Flex>
      </Flex>
      {selected ? <Box>you select {selected.content}</Box> : ""}
      <Flex>
        <Wrap maxW="300px" mx={["5%", "10%"]} spacing="1" justify="center">
          {props.feed.map((post) => (
            <WrapItem key={post.id} overflow="hidden">
              <Box
                position="relative"
                width="100px"
                height="100px"
                onClick={() => {
                  (document.activeElement as HTMLElement).focus();
                  setSelected((p) => {
                    if (!p || p.id !== post.id) {
                      return post;
                    }
                    return null;
                  });
                }}
              >
                <Image
                  layout="fill"
                  src={post.music.imageUrl}
                  alt="No ArtWork"
                />
              </Box>
            </WrapItem>
          ))}
        </Wrap>
        <CollageContext.Provider value={value}>
          <Collages items={collages} onSortEnd={onSortEnd} axis="xy" />
        </CollageContext.Provider>
      </Flex>
    </Layout>
  );
};

export default Collage;
