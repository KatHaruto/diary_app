import React, { useContext } from "react";
import CollageItem from "./Item";
import { SortableElement } from "react-sortable-hoc";
import { Grid } from "@chakra-ui/react";
import {
  CollageContext,
  CollageContextType,
  CollageItemType,
} from "../../pages/collage";
const SortableItem = SortableElement(CollageItem);

const CollageContainer: React.FC<{ items: CollageItemType[] }> = ({
  items,
}) => {
  const col = useContext<CollageContextType>(CollageContext);
  return (
    <Grid
      maxW={["350px", "640px"]}
      maxH={["350px", "640px"]}
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
