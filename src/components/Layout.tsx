import React, { ReactNode } from 'react';
import { Box, useColorMode } from '@chakra-ui/core';

import Header from './Header';
import NavStrip from './NavStrip';
import { bgColor2 } from '../utils/theme';

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  const { colorMode } = useColorMode();

  return (
    <Box h="100vh" bg={bgColor2[colorMode]}>
      <Header />
      <NavStrip />
      <Box w="100vw" m="2rem auto" p="1rem 1.25rem" bg={bgColor2[colorMode]}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
