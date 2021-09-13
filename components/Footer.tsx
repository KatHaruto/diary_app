import { Box, Container, Stack, Text } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/system";
import React from "react";

const Footer: React.FC = () => {
  return (
    <Box mt="10">
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ md: "space-between" }}
        align={{ md: "center" }}
      >
        <Text fontSize="xx-small" fontWeight="hairline">
          © 2021 Haruto Katsushiro
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
