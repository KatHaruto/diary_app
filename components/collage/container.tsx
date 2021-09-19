import React, { useContext } from "react";
import CollageItem from "./Item";
import { SortableElement } from "react-sortable-hoc";
import { Grid } from "@chakra-ui/react";
import { CollageContext } from "../../pages/collage";
const SortableItem = SortableElement(CollageItem);

const CollageContainer = ({ items }) => {
  const col = useContext(CollageContext);
  return (
    <Grid
      maxW={["350px", "420px"]}
      maxH={["350px", "420px"]}
      templateColumns={`repeat(${col.columns}, 1fr)`}
      templateRows={`repeat(${col.rows}, 1fr)`}
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
