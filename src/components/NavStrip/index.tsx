import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flex, Box, Icon, Text, useColorMode } from '@chakra-ui/core';

import { StyledLink, Wrapper } from './NavStrip.style';
import { bgColor4 } from '../../utils/theme';

const NavStrip = (): JSX.Element => {
  const router = useRouter();
  const { colorMode } = useColorMode();

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
        </Flex>
      </Box>
    </Wrapper>
  );
};

export default NavStrip;
