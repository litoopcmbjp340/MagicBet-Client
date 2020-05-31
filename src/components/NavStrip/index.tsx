import React from "react";

import Link from "next/link";
import { Flex, Box, Icon, Link as ChakraLink } from "@chakra-ui/core";

const NavStrip = () => {
  return (
    <Box
      display={{ sm: "none", md: "block" }}
      backgroundColor="red.100"
      borderBottomWidth="1px"
    >
      <Box width="100%" margin="0 auto">
        <Flex as="nav" justifyContent="center">
          <Flex marginRight="2rem">
            <Link href="/dashboard">
              <ChakraLink
                display="flex"
                alignItems="center"
                padding="1rem 0"
                cursor="pointer"
                textDecoration="none"
                color="gray.100"
                borderBottom="2px solid transparent"
                _hover={{
                  color: "white.100",
                  borderBottom: "2px solid white.100",
                }}
              >
                <Icon name="dashboard" />
                <span style={{ marginLeft: "0.25rem" }}>Dashboard</span>
              </ChakraLink>
            </Link>
          </Flex>
          <Flex marginRight="2rem">
            <Link href="/markets">
              <ChakraLink
                display="flex"
                alignItems="center"
                padding="1rem 0"
                cursor="pointer"
                textDecoration="none"
                color="gray.100"
                borderBottom="2px solid transparent"
                _hover={{
                  color: "white.100",
                  borderBottom: "2px solid white.100",
                }}
              >
                <Icon name="markets" />
                <span style={{ marginLeft: "0.25rem" }}>Markets</span>
              </ChakraLink>
            </Link>
          </Flex>

          <Flex marginRight="0">
            <Link href="/account">
              <ChakraLink
                display="flex"
                alignItems="center"
                padding="1rem 0"
                cursor="pointer"
                textDecoration="none"
                color="gray.100"
                borderBottom="2px solid transparent"
                _hover={{
                  color: "white.100",
                  borderBottom: "2px solid white.100",
                }}
              >
                <Icon name="account" />
                <span style={{ marginLeft: "0.25rem" }}>Account</span>
              </ChakraLink>
            </Link>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default NavStrip;
