import React, { useState, useEffect, useContext } from 'react';
import NextLink from 'next/link';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  Flex,
  Heading,
  Button,
  Icon,
  Link,
  Tag,
  Box,
  IconButton,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/core';
import { Contract } from '@ethersproject/contracts';

import { ContractContext } from '../../state/contracts/Context';
import { useEagerConnect, useInactiveListener } from '../../hooks';
import { injected, getNetwork, network } from '../../utils/connectors';
import { shortenAddress } from '../../utils';
import { bgColor3, bgColor4 } from '../../utils/theme';
import { checkOwner } from '../../utils';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    account,
    active,
    activate,
    chainId,
    connector,
    error,
    library,
  } = useWeb3React<Web3Provider>();
  const [owner, setOwner] = useState<string>('');
  const [ENSName, setENSName] = useState<string>('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const triedEager = useEagerConnect();

  // useEffect(() => {
  //   if (triedEager && !active && !error) activate(network);
  // }, [triedEager, active, error, activate]);

  useInactiveListener(!triedEager);

  const [factoryContract, setFactoryContract] = useState<Contract>();

  const { contracts } = useContext(ContractContext);
  const FactoryContract = contracts[0];

  useEffect(() => {
    if (!!library) setFactoryContract(FactoryContract.connect(library));
  }, [library]);

  useEffect(() => {
    (async () => {
      if (factoryContract !== undefined)
        setOwner(await factoryContract.owner());
    })();
  }, []);

  useEffect(() => {
    if (library && account) {
      let isStale = false;
      library
        .lookupAddress(account)
        .then((name) => {
          if (!isStale && typeof name === 'string') setENSName(name);
        })
        .catch(() => {});
      return () => {
        isStale = true;
        setENSName('');
      };
    }
  }, [library, account, chainId]);

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
          <NextLink href="/dashboard" passHref>
            <Link _hover={{ cursor: 'pointer' }}>
              <Flex direction="row" align="center" justify="center" mr={5}>
                <Box
                  as="span"
                  fontSize="3rem"
                  w="100%"
                  mr="0.5rem"
                  role="img"
                  aria-label="tophat"
                >
                  🎩
                </Box>
                <Heading as="h1" size="xl">
                  MagicBet
                </Heading>
              </Flex>
            </Link>
          </NextLink>
          <Flex align="center" justify="flex-end">
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
            <Link
              mr="1rem"
              href="https://github.com/BetTogether"
              isExternal
              aria-label="Github Link"
            >
              <Icon name="githubIcon" size="2rem" color="light.100" />
            </Link>

            {connector === injected ? (
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
                {ENSName || (!!account && shortenAddress(account))}
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
                w="auto"
                borderColor={bgColor4[colorMode]}
                bg={bgColor4[colorMode]}
                _hover={{ bg: bgColor4[colorMode] }}
                _active={{ bg: bgColor4[colorMode] }}
                onClick={() => activate(injected)}
              >
                Connect
              </Button>
            )}

            <Box display={{ sm: 'block', md: 'none' }}>
              <IconButton
                ml="0.5rem"
                aria-label="open"
                variant="ghost"
                variantColor="white"
                icon="triangle-down"
                onClick={onOpen}
              />
            </Box>
          </Flex>
        </Flex>

        <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody>
              <Flex justify="center" align="center" my="1rem">
                <NextLink href="/dashboard" passHref>
                  <Link
                    textTransform="uppercase"
                    fontWeight="bold"
                    href="/dashboard"
                    fontSize="1.25rem"
                  >
                    Dashboard
                  </Link>
                </NextLink>
              </Flex>

              <Flex justify="center" align="center" my="1rem">
                <NextLink href="/markets" passHref>
                  <Link
                    textTransform="uppercase"
                    fontWeight="bold"
                    href="/markets"
                    fontSize="1.25rem"
                  >
                    Markets
                  </Link>
                </NextLink>
              </Flex>

              <Flex justify="center" align="center" my="1rem">
                {account && checkOwner(account, owner) && (
                  <Link
                    textTransform="uppercase"
                    fontWeight="bold"
                    href="/admin"
                    fontSize="1.25rem"
                  >
                    Admin
                  </Link>
                )}
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }
};

export default Header;
