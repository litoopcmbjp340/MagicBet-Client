import React from "react";
import { Flex, Heading, Text, useColorMode } from "@chakra-ui/core";

import { bgColor } from "theme";

const NotFound = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-evenly"
      textAlign="center"
      height="100%"
      backgroundColor={bgColor[colorMode]}
      paddingBottom="1rem"
    >
      <Heading as="h1">Page Not Found</Heading>
      <Text>
        Sorry, but the requested page you are looking for does not exist
      </Text>
      <Heading as="h1" fontStyle="normal" fontSize="200px" marginTop="0.2rem">
        404
      </Heading>
    </Flex>
  );
};

export default NotFound;
