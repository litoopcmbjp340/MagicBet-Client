import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flex, Box, Icon, Text, useColorMode } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { StyledLink, Wrapper } from './NavStrip.style';
import { bgColor4 } from '../../utils/theme';
import { useFactoryContractNoSigner } from '../../hooks/useHelperContract';

const NavStrip = (): JSX.Element => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const { account } = useWeb3React<Web3Provider>();

  const [owner, setOwner] = useState<string>('');
  const factoryContract = useFactoryContractNoSigner();

  useEffect(() => {
    let isStale = false;
    if (!isStale && factoryContract.provider !== null)
      factoryContract.owner().then((res: string) => setOwner(res));
    return () => {
      isStale = true;
    };
  }, [factoryContract]);

  const checkOwner = (): boolean => {
    if (owner !== null && account !== null) {
      if (account === null) return false;
      return account === owner;
    } else {
      return false;
    }
  };

  return (
    <Wrapper>
      <Box w="100%" m="0 auto" bg={bgColor4[colorMode]}>
        <Flex as="nav" justifyContent="center">
          <Flex mr="2rem" fontSize="1.25rem">
            <Link href="/dashboard" passHref>
              <StyledLink active={router.pathname === '/dashboard'}>
                <Icon name="dashboardIcon" />
                <Text style={{ marginLeft: '0.25rem' }}>Dashboard</Text>
              </StyledLink>
            </Link>
          </Flex>
          <Flex mr="2rem" fontSize="1.25rem">
            <Link href="/markets" passHref>
              <StyledLink active={router.pathname === '/markets'}>
                <Icon name="marketsIcon" />
                <Text style={{ marginLeft: '0.25rem' }}>Markets</Text>
              </StyledLink>
            </Link>
          </Flex>
          {checkOwner() && (
            <Flex mr="2rem" fontSize="1.25rem">
              <Link href="/admin" passHref>
                <StyledLink active={router.pathname === '/admin'}>
                  <Icon name="edit" />
                  <Text style={{ marginLeft: '0.25rem' }}>Admin</Text>
                </StyledLink>
              </Link>
            </Flex>
          )}
        </Flex>
      </Box>
    </Wrapper>
  );
};

export default NavStrip;
