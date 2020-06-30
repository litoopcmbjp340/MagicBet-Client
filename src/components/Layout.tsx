import React, { useEffect, ReactNode } from 'react';
import { Box, useColorMode } from '@chakra-ui/core';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import Header from './Header';
import NavStrip from './NavStrip';
import { bgColor2 } from '../utils/theme';
import { network } from '../utils/connectors';
import { useEagerConnect, useInactiveListener } from '../hooks';

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  const { colorMode } = useColorMode();
  const { activate, active, error } = useWeb3React<Web3Provider>();

  const triedEager = useEagerConnect();

  useEffect(() => {
    if (triedEager && !active && !error) activate(network);
  }, [triedEager, active, error, activate]);

  useInactiveListener(!triedEager);

  return (
    <Box bg={bgColor2[colorMode]}>
      <Header triedEager={triedEager} />
      <NavStrip />
      <Box w="100vw" m="2rem auto" p="1rem 1.25rem">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
