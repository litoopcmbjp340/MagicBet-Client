import React, { useState, useEffect, useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { Flex, Box, Icon, Text, useColorMode } from '@chakra-ui/core';
import styled from '@emotion/styled';

import { ContractContext } from '../../state/contracts/Context';
import { checkOwner } from '../../utils';
import { bgColor4 } from '../../utils/theme';

const StyledLink = styled.a<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  text-decoration: none;
  border-bottom-width: 2px;
  color: ${({ active }) => (active ? '#f4f5f9' : '#eceffb')};
  border-bottom-color: ${({ active }) => (active ? '#f4f5f9' : 'transparent')};
  &:hover {
    color: #f4f5f9;
    border-bottom-color: #f4f5f9;
    border-bottom-width: 2px;
  }
`;

const NavStrip = (): JSX.Element | null => {
  const { pathname } = useRouter();
  const { colorMode } = useColorMode();
  const { account, error, library } = useWeb3React<Web3Provider>();

  const { contracts } = useContext(ContractContext);
  const FactoryContract = contracts[0];

  const [factoryContract, setFactoryContract] = useState<Contract>();
  const [owner, setOwner] = useState<string>('');

  useEffect(() => {
    if (!!library) setFactoryContract(FactoryContract.connect(library));
  }, [library]);

  useEffect(() => {
    let isStale = false;
    if (!isStale && factoryContract !== undefined)
      factoryContract.owner().then((res: string) => setOwner(res));
    return () => {
      isStale = true;
    };
  }, [factoryContract]);

  if (error) {
    return null;
  } else if (!library) {
    return null;
  } else {
    return (
      <Box
        w="100%"
        m="0 auto"
        bg={bgColor4[colorMode]}
        display={{ sm: 'none', md: 'block' }}
      >
        <Flex as="nav" justify="center">
          <Flex mr="2rem" fontSize="1.25rem">
            <NextLink href="/dashboard" passHref>
              <StyledLink active={pathname === '/dashboard'}>
                <Icon name="dashboardIcon" />
                <Text ml="0.25rem">Dashboard</Text>
              </StyledLink>
            </NextLink>
          </Flex>
          <Flex mr="2rem" fontSize="1.25rem">
            <NextLink href="/markets" passHref>
              <StyledLink active={pathname === '/markets'}>
                <Icon name="marketsIcon" />
                <Text ml="0.25rem">Markets</Text>
              </StyledLink>
            </NextLink>
          </Flex>
          {account && checkOwner(account, owner) && (
            <Flex mr="2rem" fontSize="1.25rem">
              <NextLink href="/admin" passHref>
                <StyledLink active={pathname === '/admin'}>
                  <Icon name="edit" />
                  <Text ml="0.25rem">Admin</Text>
                </StyledLink>
              </NextLink>
            </Flex>
          )}
        </Flex>
      </Box>
    );
  }
};

export default NavStrip;
