import React, { useState, useEffect } from "react";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Box from "3box";
import {
  Flex,
  Heading,
  Button,
  Icon,
  Text,
  Link,
  Avatar,
  Box as ChakraBox,
  IconButton,
  useColorMode,
} from "@chakra-ui/core";

import { useEagerConnect, useInactiveListener } from "hooks";
import { injected } from "utils/connectors";
import { bgColorHeader, bgColorConnectButton, bgColorDropDown } from "theme";

const Header = (): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { account, active, activate, connector, error } = useWeb3React<
    Web3Provider
  >();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [image, setImage] = useState<string>();
  const [activatingConnector, setActivatingConnector] = useState<
    AbstractConnector
  >();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector)
      setActivatingConnector(undefined);
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);

  useEffect(() => {
    (async () => {
      if (active) {
        try {
          const profile = await Box.getProfile(account);
          if (profile.image) {
            let imageHash = profile.image[0]["contentUrl"]["/"];
            setImage(`https://ipfs.infura.io/ipfs/${imageHash}`);
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, [active, account]);

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        padding="0.75rem 1.25rem"
        color="light.100"
        bg={bgColorHeader[colorMode]}
        margin="0 auto"
      >
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          mr={5}
        >
          <span
            style={{ fontSize: "3rem", width: "100%", marginRight: "0.5rem" }}
            role="img"
            aria-label="tophat"
          >
            🎩
          </span>
          <Heading as="h1" size="xl">
            MagicBet
          </Heading>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end">
          <IconButton
            aria-label={`Switch to ${
              colorMode === "light" ? "dark" : "light"
            } mode`}
            variant="ghost"
            variantColor="white"
            mr="2"
            fontSize="1.5rem"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? "moon" : "sun"}
            _hover={{ bg: "Transparent" }}
          />
          <Link
            background="none"
            marginRight="1rem"
            cursor="pointer"
            href="https://github.com/BetTogether"
            isExternal
            aria-label="Github Link"
          >
            <Icon name="githubIcon" size="2rem" color="light.100" />
          </Link>

          {active && !error ? (
            <>
              {account !== null && (
                <>
                  {image ? (
                    <Avatar size="md" showBorder src={image} />
                  ) : (
                    <Avatar showBorder src="https://bit.ly/broken-link" />
                  )}
                </>
              )}
            </>
          ) : (
            <Button
              border="1px"
              borderRadius="4px"
              variant="solid"
              color="light.100"
              cursor="pointer"
              margin="0"
              position="relative"
              width="auto"
              borderColor={bgColorConnectButton[colorMode]}
              bg={bgColorConnectButton[colorMode]}
              _hover={{ bg: bgColorConnectButton[colorMode] }}
              _active={{ bg: bgColorConnectButton[colorMode] }}
              onClick={() => {
                setActivatingConnector(injected);
                activate(injected);
              }}
            >
              Connect
            </Button>
          )}
          {active && (
            <ChakraBox
              display={{ sm: "block", md: "none" }}
              onClick={() => setIsExpanded(!isExpanded)}
              padding="0.625rem"
            >
              {isExpanded ? (
                <Icon name="menuIconOpen" size="2rem" />
              ) : (
                <Icon name="menuIconClosed" size="2rem" />
              )}
            </ChakraBox>
          )}
        </Flex>
      </Flex>
      {isExpanded && (
        <ChakraBox
          height="auto"
          width="100%"
          position="absolute"
          zIndex={100}
          backgroundColor={bgColorDropDown[colorMode]}
          display={{ sm: "block", md: "none" }}
        >
          <ChakraBox
            margin="0"
            padding="0"
            borderBottom="1px solid rgba(0, 0, 0, 0.8)"
          >
            <Text
              font-weight="500"
              height="3rem"
              padding="0 1rem"
              mt={{ base: 4, md: 0 }}
              mr={6}
              display="block"
            >
              <Link
                textTransform="uppercase"
                fontWeight="bold"
                cursor="pointer"
                href="/dashboard"
                onClick={() => setIsExpanded(false)}
              >
                Dashboard
              </Link>
            </Text>
            <Text
              font-weight="500"
              height="3rem"
              padding="0 1rem"
              mt={{ base: 4, md: 0 }}
              mr={6}
              display="block"
            >
              <Link
                textTransform="uppercase"
                fontWeight="bold"
                cursor="pointer"
                href="/markets"
                onClick={() => setIsExpanded(false)}
              >
                Markets
              </Link>
            </Text>
            <Text
              font-weight="500"
              height="3rem"
              padding="0 1rem"
              mt={{ base: 4, md: 0 }}
              mr={6}
              display="block"
            >
              <Link
                textTransform="uppercase"
                fontWeight="bold"
                cursor="pointer"
                href="/account"
                onClick={() => setIsExpanded(false)}
              >
                Account
              </Link>
            </Text>
          </ChakraBox>
        </ChakraBox>
      )}
    </>
  );
};

export default Header;
