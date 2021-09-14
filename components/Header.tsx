import React from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
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
              <Link href="/api/auth/signin">
                <a>
                  <Button
                    variant={"solid"}
                    colorScheme={"teal"}
                    size={"sm"}
                    leftIcon={<AddIcon />}
                  >
                    Log in
                  </Button>
                </a>
              </Link>
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

export default Header;
