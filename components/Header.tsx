import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { RiArticleLine, RiLogoutBoxRLine } from "react-icons/ri";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const [session, loading] = useSession();

  const left = (
    <Flex align="center" mr={5} color="black">
      <Heading as="h1" size="lg" letterSpacing={"tighter"}>
        <Link href="/">
          <Text>App</Text>
        </Link>
      </Heading>
    </Flex>
  );

  let right = null;

  if (loading) {
    right = (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          <a data-active={isActive("/signup")}>
            <Button size="md" colorScheme="blue" mt="24px">
              Log in
            </Button>
          </a>
        </Link>
      </div>
    );
  }

  if (session) {
    right = (
      <HStack spacing="5%">
        <IconButton
          mr="-3%"
          size="lg"
          aria-label="Search database"
          color="gray"
          colorScheme="whiteAlpha"
          icon={<SearchIcon />}
        />
        <Menu>
          <MenuButton aria-label="Options" variant="outline">
            <Avatar
              ml="-3%"
              size="sm"
              borderRadius="full"
              src={session.user.image}
            />
          </MenuButton>

          <MenuList color="black">
            <MenuItem>{session.user.name}</MenuItem>
            <MenuDivider />
            <MenuItem
              icon={<RiArticleLine />}
              onClick={() => {
                router.push("/posts");
              }}
            >
              My Post
            </MenuItem>
            <MenuItem icon={<RiLogoutBoxRLine />} onClick={() => signOut()}>
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>

        {router.pathname !== "/create" ? (
          <Link href="/create">
            <Button size="sm" colorScheme="blue">
              <a>New post</a>
            </Button>
          </Link>
        ) : (
          ""
        )}
      </HStack>
    );
  }

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        my="2%"
        mx="3%"
        color="white"
      >
        {left}
        {right}
      </Flex>
    </Box>
  );
};

export default Header;
