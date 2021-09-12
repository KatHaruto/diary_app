import React from "react";
import NextLink from "next/link";
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
  MenuItemOption,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { RiArticleLine, RiLogoutBoxRLine } from "react-icons/ri";
import Link from "../lib/Link";

import { useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const Links = [
  { name: "Home", a: "/" },
  { name: "Hoge", a: "#" },
  { name: "Fuga", a: "#" },
];

const NavLink = ({ name, a }) => (
  <Link
    href={a}
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
  >
    {name}
  </Link>
);

const Header: React.FC = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (loading) {
    return null;
  }
  if (!session) {
    return null;
  }

  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box fontWeight="semibold">Logo</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link.name} name={link.name} a={link.a} />
              ))}
            </HStack>
          </HStack>
          <HStack spacing={{ base: "3", md: "6" }}>
            <IconButton
              mr="-2"
              size="lg"
              variant="ghost"
              aria-label="Search database"
              color="gray"
              colorScheme="whiteAlpha"
              icon={<SearchIcon />}
            />
            <Menu isLazy id="menu_header">
              <MenuButton cursor={"pointer"}>
                <Avatar size={"sm"} src={session.user.image} />
              </MenuButton>
              <MenuList>
                <MenuItem>{session.user.name}</MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<RiArticleLine />}
                  onClick={() => {
                    router.push("/posts");
                  }}
                >
                  My post
                </MenuItem>
                <MenuItem
                  icon={<RiLogoutBoxRLine />}
                  onClick={() => {
                    signOut();
                  }}
                >
                  Log out{" "}
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              variant={"solid"}
              colorScheme={"teal"}
              size={"sm"}
              leftIcon={<AddIcon />}
              onClick={() => {
                router.push("/create");
              }}
            >
              Add new
            </Button>
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name} name={link.name} a={link.a} />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

////////////////////////////
/*
const Header: React.FC = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

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
      <Box>
        <Text>Validating session ...</Text>
      </Box>
    );
  }

  if (!session) {
    right = (
      <Box>
        <Link href="/api/auth/signin">
          <a>
            <Button size="md" colorScheme="blue" mt="24px">
              Log in
            </Button>
          </a>
        </Link>
      </Box>
    );
  }

  if (session) {
    //Switching Hstack to Flex because error could not be resolved.
    //https://github.com/chakra-ui/chakra-ui/issues/3173
    right = (
      <Stack
        flex={{ base: 1, md: 0 }}
        justify={"flex-end"}
        direction={"row"}
        spacing={6}
      >
        <IconButton
          mr="-3%"
          size="lg"
          aria-label="Search database"
          color="gray"
          colorScheme="whiteAlpha"
          icon={<SearchIcon />}
        />
        <Menu isLazy id="header">
          <MenuButton aria-label="Options" variant="outline">
            <Avatar
              ml="-3%"
              name="profile"
              size="sm"
              src={session.user.image}
            />
          </MenuButton>

          <MenuList color="black">
            <MenuItem>{session.user.name}</MenuItem>
            <MenuDivider />
            <MenuItemOption
              icon={<RiArticleLine />}
              id="header_list_icon"
              onClick={() => {
                router.push("/posts");
              }}
            >
              My Post
            </MenuItemOption>
            <MenuItemOption
              icon={<RiLogoutBoxRLine />}
              onClick={() => signOut()}
            >
              Log Out
            </MenuItemOption>
          </MenuList>
        </Menu>

        {router.pathname !== "/create" ? (
          <Link href="/create">
            <a>
              <Button size="sm" colorScheme="blue">
                New post
              </Button>
            </a>
          </Link>
        ) : (
          ""
        )}
      </Stack>
    );
  }

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        my="5%"
        mx="3%"
        color="white"
      >
        {left}
        {right}
      </Flex>
    </Box>
  );
};
*/
export default Header;
