import React, { ReactNode } from 'react';
import { Box, useColorMode } from '@chakra-ui/core';

import Header from './Header';
import NavStrip from './NavStrip';
import { bgColor2 } from '../utils/theme';

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Header />
      <NavStrip />
      <Box pt="1rem" w="100vw" h="100vh" m="0 auto" bg={bgColor2[colorMode]}>
        <Box w="100%" p="0.75rem">
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
