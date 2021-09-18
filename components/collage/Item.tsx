import {
  Box,
  Button,
  GridItem,
  IconButton,
  useCallbackRef,
} from "@chakra-ui/react";
import React, { useCallback, useContext } from "react";
import Image from "next/image";
import { CollageContext } from "../../pages/collage";
import { SmallCloseIcon } from "@chakra-ui/icons";

const CollageItem: React.FC<{ id: number; url: string; ind: number }> = ({
  id,
  url,
  ind,
}) => {
  const col = useContext(CollageContext);
  const DelCollageItem = useCallback(
    (ind) => {
      let new_collages = col.collages.slice(0, col.collages.length);
      new_collages[ind] = {
        id: -(col.height * col.width + col.collages[ind].id),
        url: "",
      };
      col.setCollages(new_collages);
    },
    [col]
  );
  return (
    <GridItem
      key={id}
      minH="200px"
      minW="200px"
      border="1px"
      bgColor="gray.100"
      borderColor="gray.200"
    >
      {url ? (
        <Box position="relative" width="200px" height="200px">
          <Image layout="fill" src={url} alt="No ArtWork" />
          <IconButton
            display="inline"
            aria-label="delete collage"
            icon={<SmallCloseIcon />}
            position="absolute"
            size="sm"
            isRound
            top="0"
            left="0"
            variant="ghost"
            color="black"
            cursor="pointer"
            onClick={() => {
              DelCollageItem(ind);
            }}
          />
        </Box>
      ) : (
        ""
      )}
    </GridItem>
  );
};

export default CollageItem;
