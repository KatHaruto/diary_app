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
import { Button, Grid, Select, VStack } from "@chakra-ui/react";
import { createContext } from "react";
import { useEffect } from "react";
import { Canvas } from "canvas";

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
  const [imageURL, setImageURL] = useState("");
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(3);
  const [collages, setCollages] = useState([]);

  useEffect(() => {
    const len = collages.length;
    const diff = width * height - len;
    console.log(diff);
    if (diff >= 0) {
      let new_collages = collages.slice(0, collages.length);
      for (let i = 1; i <= diff; i++) {
        new_collages.push({ id: -(len + i) });
      }
      setCollages(new_collages);
    } else {
      let new_collages = collages.slice(0, collages.length);
      new_collages.splice(width * height, -diff);
      setCollages(new_collages);
    }
  }, [width, height]);
  const onSortEnd = (e) => {
    const newCollages = arrayMoveImmutable(collages, e.oldIndex, e.newIndex);
    setCollages(newCollages);
  };
  const AddCollageItem = (id, url) => {
    if (collages.map((c) => c.id).includes(id)) {
      return;
    }
    let new_collages = collages.slice(0, collages.length);
    const ind = collages.findIndex((p) => !p.url);
    new_collages[ind] = { id: id, url: url };
    setCollages(new_collages);
  };

  const canvasSubmit = async () => {
    const data = {
      width: width,
      height: height,
      collages: collages,
    };
    const image = await fetch("api/collage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.blob());

    setImageURL((window.URL || window.webkitURL).createObjectURL(image));
  };

  const value = {
    width: width,
    height: height,
    collages: collages,
    setCollages: setCollages,
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
          {imageURL ? (
            <>
              <a href={imageURL} target="_blank">
                preview
              </a>
              <a href={imageURL} download>
                Download
              </a>
            </>
          ) : (
            ""
          )}
        </Flex>
      </Flex>
      <Flex>
        <Wrap maxW="300px" mx={["5%", "10%"]} spacing="1" justify="center">
          {props.feed.map((post) => (
            <WrapItem key={post.id} overflow="hidden">
              <Box
                position="relative"
                width="100px"
                height="100px"
                onClick={() => {
                  AddCollageItem(post.id, post.music.imageUrl);
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
        <VStack>
          <Flex ml="auto">
            <Select
              placeholder="width"
              onChange={(e) => setWidth(Number(e.target.value))}
              size="sm"
            >
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
            <Select
              placeholder="height"
              onChange={(e) => setHeight(Number(e.target.value))}
              size="sm"
            >
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
            {width > 0 && height > 0 ? (
              <Button onClick={canvasSubmit}>save</Button>
            ) : (
              ""
            )}
          </Flex>
          <CollageContext.Provider value={value}>
            <Collages items={collages} onSortEnd={onSortEnd} axis="xy" />
          </CollageContext.Provider>
        </VStack>
      </Flex>
    </Layout>
  );
};

export default Collage;
