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

import { useEagerConnect } from "hooks/useEagerConnect";
import { useInactiveListener } from "hooks/useInactiveListener";
import { injected, getNetwork } from "utils/connectors";

const Header = () => {
  const {
    account,
    active,
    activate,
    connector,
    deactivate,
    error,
  } = useWeb3React<Web3Provider>();

  const { colorMode, toggleColorMode } = useColorMode();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [image, setImage] = useState<any>();

  const [activatingConnector, setActivatingConnector] = useState<
    AbstractConnector
  >();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector)
      setActivatingConnector(undefined);
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();

  useEffect(() => {
    if (triedEager && !active && !error) activate(getNetwork(42));
  }, [triedEager, active, error, activate]);

  useInactiveListener(!triedEager || !!activatingConnector);

  const MenuItem = ({ children }: any) => (
    <Text
      color="dark.100"
      font-weight="500"
      height="3rem"
      padding="0 1rem"
      mt={{ base: 4, md: 0 }}
      mr={6}
      display="block"
    >
      {children}
    </Text>
  );

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

  const bgColor = { light: "#252c41", dark: "#00ff00" };

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        padding="0.75rem 1.25rem"
        color="light.100"
        backgroundColor="dark.100"
        // backgroundColor={bgColor[colorMode]}
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
            color="current"
            mr="2"
            fontSize="20px"
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
            rel="noreferrer noopener"
            aria-label="Github Link"
          >
            <Icon name="githubIcon" size="2rem" color="light.100" />
          </Link>

          {active && !error ? (
            <>
              {account !== null && (
                <>
                  {image ? (
                    <Link
                      href="https://3box.io/hub"
                      isExternal
                      rel="noopener noreferrer"
                    >
                      <Avatar size="md" name="Profile" showBorder src={image} />
                    </Link>
                  ) : (
                    <Link
                      href="https://3box.io/hub"
                      isExternal
                      rel="noopener noreferrer"
                    >
                      <Avatar showBorder src="https://bit.ly/broken-link" />
                    </Link>
                  )}
                  <Button
                    backgroundColor="primary.100"
                    aria-label="LogOut"
                    marginLeft="1rem"
                    size="lg"
                    padding="0"
                    onClick={() => deactivate()}
                  >
                    <Icon name="power" color="white.200" size="1.5rem" />
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button
              backgroundColor="primary.100"
              border="1px"
              borderRadius="4px"
              borderColor="primary.100"
              color="light.100"
              cursor="pointer"
              margin="0"
              position="relative"
              width="auto"
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
          backgroundColor="light.100"
          display={{ sm: "block", md: "none" }}
        >
          <ChakraBox
            margin="0"
            padding="0"
            borderBottom="1px solid rgba(0, 0, 0, 0.8)"
          >
            <MenuItem>
              <Link
                textTransform="uppercase"
                fontWeight="bold"
                cursor="pointer"
                href="/dashboard"
                onClick={() => setIsExpanded(false)}
              >
                Dashboard
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                textTransform="uppercase"
                fontWeight="bold"
                cursor="pointer"
                href="/markets"
                onClick={() => setIsExpanded(false)}
              >
                Markets
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                textTransform="uppercase"
                fontWeight="bold"
                cursor="pointer"
                href="/account"
                onClick={() => setIsExpanded(false)}
              >
                Account
              </Link>
            </MenuItem>
          </ChakraBox>
        </ChakraBox>
      )}
    </>
  );
};

export default Header;
