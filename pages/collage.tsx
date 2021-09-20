import { Box, Flex, Wrap, WrapItem } from "@chakra-ui/layout";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import React, { useCallback, useState } from "react";
import Layout from "../components/Layout";
import Image from "next/image";
import prisma from "../lib/prisma";

import { SortableContainer } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import CollageContaniner from "../components/collage/container";
import {
  Button,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from "@chakra-ui/react";
import { createContext } from "react";
import { useEffect } from "react";

type CollageProps = {
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

export type CollageItemType = {
  id: number;
  url: string;
};
export type CollageContextType = {
  columns: number;
  rows: number;
  collages: CollageItemType[];
  setCollages: React.Dispatch<React.SetStateAction<CollageItemType[]>>;
};

type CollageCandidateItemProps = {
  id: number;
  url: string;
  addHandler: (arg: CollageItemType) => void;
};

type CollageMenuProps = {
  columns: number;
  rows: number;
  setColumns: React.Dispatch<React.SetStateAction<number>>;
  setRows: React.Dispatch<React.SetStateAction<number>>;
  submitCanvas: () => Promise<void>;
};

type CollageResultMenuProps = {
  imageURL: string;
};

export const CollageContext = createContext<CollageContextType>(null);

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

const CollageCandidateItem: React.FC<CollageCandidateItemProps> = ({
  id,
  url,
  addHandler,
}) => {
  return (
    <Box
      position="relative"
      width={["70px", "100px"]}
      height={["70px", "100px"]}
      onClick={() => {
        addHandler({ id: id, url: url });
      }}
    >
      <Image layout="fill" src={url} alt="No ArtWork" />
    </Box>
  );
};

const CollageMenu: React.FC<CollageMenuProps> = ({
  columns,
  rows,
  setColumns,
  setRows,
  submitCanvas,
}) => {
  return (
    <HStack>
      <NumberInput
        maxW="50px"
        variant="flushed"
        size="md"
        onChange={(v) => setColumns(Number(v))}
        value={columns}
        min={1}
        max={7}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Box mt="1" mx="1">
        ×
      </Box>
      <NumberInput
        maxW="50px"
        variant="flushed"
        size="md"
        onChange={(v) => setRows(Number(v))}
        value={rows}
        min={1}
        max={7}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {
        <Button mr="3" colorScheme="teal" size="sm" onClick={submitCanvas}>
          Collage
        </Button>
      }
    </HStack>
  );
};

const CollageResultMenu: React.FC<CollageResultMenuProps> = ({ imageURL }) => {
  return (
    <HStack spacing="2">
      <Button
        size="xs"
        colorScheme="teal"
        as="a"
        href={imageURL}
        target="_blank"
      >
        <Box fontSize="xs">preview</Box>
      </Button>
      <Button
        size="xs"
        colorScheme="teal"
        as="a"
        href={imageURL}
        download="collage.jpg"
      >
        <Box fontSize="xs">download</Box>
      </Button>
    </HStack>
  );
};
const Collage: React.FC<{ feed: CollageProps[] }> = (props) => {
  //<Menu  isLazy id=<hoge>>
  //Menu is explicitly needed to set id

  const Collages = SortableContainer(CollageContaniner);
  const [imageURL, setImageURL] = useState<string>("");
  const [columns, setColumns] = useState<number>(3);
  const [rows, setRows] = useState<number>(3);
  const [collages, setCollages] = useState<CollageItemType[]>([]);
  const [CollageContextValue, setCollageContextValue] =
    useState<CollageContextType>({
      columns: columns,
      rows: rows,
      collages: collages,
      setCollages: setCollages,
    });
  const [noImageId, setNoImageId] = useState<number>(-1);

  useEffect(() => {
    const len = collages.length;
    const diff = columns * rows - len;
    let new_collages = collages.slice(0, collages.length);
    if (diff >= 0) {
      for (let i = 1; i <= diff; i++) {
        new_collages.push({ id: noImageId - i, url: "" });
      }
      setNoImageId((id) => id - diff);
    } else {
      new_collages.splice(columns * rows, -diff);
    }
    setCollages(new_collages);
  }, [columns, rows]);

  useEffect(() => {
    setCollageContextValue({
      columns: columns,
      rows: rows,
      collages: collages,
      setCollages: setCollages,
    });
  }, [columns, rows, collages, setCollages]);

  const onSortEnd = (e) => {
    const newCollages = arrayMoveImmutable(collages, e.oldIndex, e.newIndex);
    setCollages(newCollages);
  };
  const AddCollageItem = ({ id, url }: CollageItemType) => {
    if (collages.map((c) => c.id).includes(id)) {
      return;
    }
    let new_collages = collages.slice(0, collages.length);
    const ind = collages.findIndex((p) => !p.url);
    new_collages[ind] = { id: id, url: url };
    setCollages(new_collages);
  };

  const submitCanvas = useCallback(async () => {
    setImageURL("");
    const image = await fetch("api/collage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        columns: columns,
        rows: rows,
        collages: collages,
      }),
    }).then((res) => res.blob());

    setImageURL((window.URL || window.webkitURL).createObjectURL(image));
  }, [columns, rows, collages]);

  return (
    <Layout>
      <Flex
        justify="center"
        m="3%"
        fontWeight="semibold"
        fontSize={["20px", "28px"]}
      >
        Collage
      </Flex>
      <VStack spacing="10">
        <Wrap
          maxW={["90%", "60%"]}
          minW={["90%", "60%"]}
          spacing="1"
          justify="center"
        >
          {props.feed.map((post) => (
            <WrapItem key={post.id} overflow="hidden">
              <CollageCandidateItem
                id={post.id}
                url={post.music.imageUrl}
                addHandler={AddCollageItem}
              />
            </WrapItem>
          ))}
        </Wrap>
        <VStack spacing="5">
          <CollageMenu
            columns={columns}
            rows={rows}
            setColumns={setColumns}
            setRows={setRows}
            submitCanvas={submitCanvas}
          />
          {imageURL && <CollageResultMenu imageURL={imageURL} />}

          <CollageContext.Provider value={CollageContextValue}>
            <Collages items={collages} onSortEnd={onSortEnd} axis="xy" />
          </CollageContext.Provider>
        </VStack>
      </VStack>
    </Layout>
  );
};

export default Collage;
