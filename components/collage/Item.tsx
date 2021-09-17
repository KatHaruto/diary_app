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
  //const [isFocus,setIsFocus] = useState(false)
  const selectedContext = useContext(CollageContext);
  const handleClick = (id_, url_, ind_) => {
    console.log(url, selectedContext.selected);
    if (url && !selectedContext.selected) {
      selectedContext.Del(ind_);
    } else if (selectedContext.selected !== null) {
      selectedContext.Add(
        selectedContext.selected.id,
        selectedContext.selected.music.imageUrl,
        ind_
      );
      selectedContext.setSelected(null);
    }
  };
  return (
    <GridItem
      key={id}
      minH="100px"
      minW="100px"
      border="1px"
      bgColor="gray.100"
      borderColor="gray.200"
    >
      {url ? (
        <Box position="relative" width="100px" height="100px">
          <Image layout="fill" src={url} alt="No ArtWork" />
          <IconButton
            aria-label="delete collage"
            icon={<SmallCloseIcon />}
            position="absolute"
            size="xs"
            isRound
            isActive
            top="0"
            left="0"
            color="black"
            cursor="pointer"
            onClick={() => {
              selectedContext.Del(ind);
            }}
          />
        </Box>
      ) : (
        <Button
          width="100px"
          height="100px"
          onClick={() => {
            handleClick(id, url, ind);
          }}
        />
      )}
    </GridItem>
  );
};

export default CollageItem;
