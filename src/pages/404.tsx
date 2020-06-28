import React from 'react';
import { Flex, Heading, Text, useColorMode } from '@chakra-ui/core';

import { bgColor1 } from '../utils/theme';

const NotFound = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      direction="column"
      justify="space-evenly"
      textAlign="center"
      h="100%"
      bg={bgColor1[colorMode]}
      pb="1rem"
    >
      <Heading as="h1">Page Not Found</Heading>
      <Text>
        Sorry, but the requested page you are looking for does not exist
      </Text>
      <Heading as="h1" fontStyle="normal" fontSize="200px" mt="0.2rem">
        404
      </Heading>
    </Flex>
  );
};

export default NotFound;
