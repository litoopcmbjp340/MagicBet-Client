import React from 'react';
import { Flex, Stack, Text, useColorMode } from '@chakra-ui/core';

import { bgColor1 } from '../utils/theme';

export default function SwitchChain(): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Flex
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      bg={bgColor1[colorMode]}
      pb="1rem"
    >
      <Stack direction="column" alignItems="center">
        <Text fontSize="1.5rem" textAlign="center">
          Wrong Network. <br />
          Please connect to Kovan.
        </Text>
      </Stack>
    </Flex>
  );
}
