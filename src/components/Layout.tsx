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
      <Box
        paddingTop="1rem"
        width="100%"
        height="100%"
        margin="0 auto"
        bg={bgColor2[colorMode]}
      >
        <Box width="100%" padding="0.75rem">
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
