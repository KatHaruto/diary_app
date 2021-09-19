import { Box, GridItem, IconButton } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect } from "react";
import Image from "next/image";
import { CollageContext, CollageContextType } from "../../pages/collage";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useState } from "react";

const CollageItem: React.FC<{ id: number; url: string; ind: number }> = ({
  id,
  url,
  ind,
}) => {
  const col = useContext<CollageContextType>(CollageContext);
  const [w, setW] = useState({
    mobile: Math.floor(350 / Math.max(col.columns, col.rows)),
    desktop: Math.floor(640 / Math.max(col.columns, col.rows)),
  });
  useEffect(() => {
    setW({
      mobile: Math.floor(350 / Math.max(col.columns, col.rows)),
      desktop: Math.floor(640 / Math.max(col.columns, col.rows)),
    });
  }, [col.columns, col.rows]);

  const DelCollageItem = useCallback(
    (ind) => {
      let new_collages = col.collages.slice(0, col.collages.length);
      const deleteId =
        new_collages
          .filter((c) => c.id >= 0)
          .reduce((a, b) => (a.id < b.id ? a : b)).id - 1;
      new_collages[ind] = {
        id: deleteId,
        url: "",
      };
      col.setCollages(new_collages);
    },
    [col]
  );
  return (
    <GridItem
      key={id}
      maxH={[w.mobile, w.desktop]}
      maxW={[w.mobile, w.desktop]}
      border="1px"
      bgColor="gray.100"
      borderColor="gray.200"
    >
      {url ? (
        <Box
          position="relative"
          width={[w.mobile, w.desktop]}
          height={[w.mobile, w.desktop]}
        >
          <Image layout="fill" src={url} alt="No ArtWork" />
          <IconButton
            display="inline"
            aria-label="delete collage"
            icon={<SmallCloseIcon />}
            position="absolute"
            size="xs"
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
        <Box width={[w.mobile, w.desktop]} height={[w.mobile, w.desktop]}></Box>
      )}
    </GridItem>
  );
};

export default CollageItem;
