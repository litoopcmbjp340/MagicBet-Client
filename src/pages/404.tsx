import React from "react";
import { Flex, Heading, Text } from "@chakra-ui/core";

const NotFound = () => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-evenly"
      textAlign="center"
      height="100%"
      backgroundColor="light.100"
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
