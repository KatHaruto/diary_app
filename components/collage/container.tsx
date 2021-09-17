import React from "react";
import CollageItem from "./Item";
import { SortableElement } from "react-sortable-hoc";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useContext } from "react";
import { CollageContext } from "../../pages/collage";
const SortableItem = SortableElement(CollageItem);

const CollageContainer = ({ items }) => {
  return (
    <Grid
      maxW="300px"
      maxH="300px"
      templateColumns="repeat(3, 1fr)"
      templateRows="repeat(3, 1fr)"
    >
      {items.map((item, i) => (
        <SortableItem
          id={item.id}
          ind={i}
          url={item.url}
          index={i}
          key={item.id}
        />
      ))}
    </Grid>
  );
};

export default CollageContainer;
