import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  Flex,
  Heading,
  Button,
  Icon,
  Text,
  Link as StyledLink,
  Tag,
  Box,
  IconButton,
  useColorMode,
} from '@chakra-ui/core';

import { useEagerConnect, useInactiveListener } from '../../hooks';
import { injected, getNetwork } from '../../utils/connectors';
import { shortenAddress } from '../../utils';
import { bgColor1, bgColor3, bgColor4 } from '../../utils/theme';
import { useFactoryContract } from 'hooks/useHelperContract';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { account, active, activate, chainId, connector, error } = useWeb3React<
    Web3Provider
  >();
  const [owner, setOwner] = useState<string>('');
  const factoryContract = useFactoryContract();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  useEffect(() => {
    if (triedEager && !active && !error) activate(getNetwork(42));
  }, [triedEager, active, error, activate]);

  useEffect(() => {
    (async () => {
      if (factoryContract) setOwner(await factoryContract.owner());
    })();
  }, []);

  const checkOwner = (): boolean => {
    if (owner !== null && account !== null) {
      if (account === null) return false;
      return account === owner;
    } else {
      return false;
    }
  };

  if (error) {
    return null;
  } else if (!triedEager) {
    return null;
  } else {
    return (
      <>
        <Flex
          as="header"
          align="center"
          justify="space-between"
          p="0.75rem 1.25rem"
          color="light.100"
          bg={bgColor3[colorMode]}
          m="0 auto"
        >
          <Link href="/dashboard" passHref>
            <StyledLink _hover={{ cursor: 'pointer' }}>
              <Flex
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                mr={5}
              >
                <span
                  style={{
                    fontSize: '3rem',
                    width: '100%',
                    marginRight: '0.5rem',
                  }}
                  role="img"
                  aria-label="tophat"
                >
                  🎩
                </span>
                <Heading as="h1" size="xl">
                  MagicBet
                </Heading>
              </Flex>
            </StyledLink>
          </Link>
          <Flex alignItems="center" justifyContent="flex-end">
            <IconButton
              aria-label={`Switch to ${
                colorMode === 'light' ? 'dark' : 'light'
              } mode`}
              variant="ghost"
              variantColor="white"
              mr="2"
              fontSize="1.5rem"
              onClick={toggleColorMode}
              icon={colorMode === 'light' ? 'moon' : 'sun'}
              _hover={{ bg: 'Transparent' }}
            />
            <StyledLink
              bg="none"
              mr="1rem"
              cursor="pointer"
              href="https://github.com/BetTogether"
              isExternal
              aria-label="Github Link"
            >
              <Icon name="githubIcon" size="2rem" color="light.100" />
            </StyledLink>

            {active && !!(connector === injected) ? (
              <Tag
                border="1px"
                borderRadius="4px"
                variant="solid"
                color="light.100"
                m="0"
                position="relative"
                w="auto"
                borderColor={bgColor4[colorMode]}
                bg={bgColor4[colorMode]}
              >
                {!!account && shortenAddress(account)}
              </Tag>
            ) : (
              <Button
                border="1px"
                borderRadius="4px"
                variant="solid"
                color="light.100"
                cursor="pointer"
                m="0"
                position="relative"
                width="auto"
                borderColor={bgColor4[colorMode]}
                bg={bgColor4[colorMode]}
                _hover={{ bg: bgColor4[colorMode] }}
                _active={{ bg: bgColor4[colorMode] }}
                onClick={() => activate(injected)}
              >
                Connect
              </Button>
            )}

            <Box
              display={{ sm: 'block', md: 'none' }}
              onClick={() => setIsExpanded(!isExpanded)}
              p="0.625rem"
            >
              {isExpanded ? (
                <Icon name="menuOpenIcon" size="2rem" />
              ) : (
                <Icon name="menuClosedIcon" size="2rem" />
              )}
            </Box>
          </Flex>
        </Flex>
        {isExpanded && (
          <Box
            h="auto"
            w="100%"
            position="absolute"
            zIndex={100}
            bg={bgColor1[colorMode]}
            display={{ sm: 'block', md: 'none' }}
          >
            <Box m="0" p="0" borderBottom="1px solid rgba(0, 0, 0, 0.8)">
              <Link href="/dashboard" passHref>
                <Text
                  font-weight="500"
                  h="3rem"
                  p="0 1rem"
                  mt={{ base: 4, md: 0 }}
                  mr={6}
                  display="block"
                >
                  <StyledLink
                    textTransform="uppercase"
                    fontWeight="bold"
                    cursor="pointer"
                    href="/dashboard"
                    onClick={() => setIsExpanded(false)}
                  >
                    Dashboard
                  </StyledLink>
                </Text>
              </Link>
              <Link href="/markets" passHref>
                <Text
                  font-weight="500"
                  h="3rem"
                  p="0 1rem"
                  mt={{ base: 4, md: 0 }}
                  mr={6}
                  display="block"
                >
                  <StyledLink
                    textTransform="uppercase"
                    fontWeight="bold"
                    cursor="pointer"
                    href="/markets"
                    onClick={() => setIsExpanded(false)}
                  >
                    Markets
                  </StyledLink>
                </Text>
              </Link>
              {checkOwner() && (
                <Text
                  font-weight="500"
                  h="3rem"
                  p="0 1rem"
                  mt={{ base: 4, md: 0 }}
                  mr={6}
                  display="block"
                >
                  <StyledLink
                    textTransform="uppercase"
                    fontWeight="bold"
                    cursor="pointer"
                    href="/admin"
                    onClick={() => setIsExpanded(false)}
                  >
                    Admin
                  </StyledLink>
                </Text>
              )}
            </Box>
          </Box>
        )}
      </>
    );
  }
};

export default Header;
