import React, { useContext } from "react";
import CollageItem from "./Item";
import { SortableElement } from "react-sortable-hoc";
import { Grid } from "@chakra-ui/react";
import { CollageContext } from "../../pages/collage";
const SortableItem = SortableElement(CollageItem);

const CollageContainer = ({ items }) => {
  const col = useContext(CollageContext);
  console.log(col.collages.length);
  return (
    <Grid
      maxW="300px"
      maxH="300px"
      templateColumns={`repeat(${col.width}, 1fr)`}
      templateRows={`repeat(${col.height}, 1fr)`}
    >
      {items.map((item, i) => (
        <SortableItem
          key={item.id}
          id={item.id}
          ind={i}
          url={item.url}
          index={i}
        />
      ))}
    </Grid>
  );
};

export default CollageContainer;
