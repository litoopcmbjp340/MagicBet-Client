import React from 'react';
import { Flex, Stack, Text, Button, useColorMode } from '@chakra-ui/core';

import { bgColor1 } from '../utils/theme';

export default function Error(): JSX.Element {
  const { colorMode } = useColorMode();
  return (
    <Flex
      flexGrow={1}
      align="center"
      justify="center"
      bg={bgColor1[colorMode]}
      pb="1rem"
    >
      <Stack direction="column" align="center">
        <Text fontSize="1.5rem" textAlign="center">
          Something went wrong. <br />
          Have MetaMask and on Kovan?
        </Text>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </Stack>
    </Flex>
  );
}
