import React, { useState, useEffect } from "react";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
// import { Box as ThreeBox } from "3box";
import styled from "@emotion/styled";
import {
  Flex,
  Heading,
  Button,
  Icon,
  Text,
  Link,
  Box,
  IconButton,
  useColorMode,
} from "@chakra-ui/core";

import { useEagerConnect, useInactiveListener } from "utils/hooks";
import { shortenAddress } from "utils";
import { injected } from "utils/connectors";

const Header = () => {
  const context = useWeb3React();
  const { account, active, activate, connector, deactivate, error } = context;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [image, setImage] = useState<any>();
  const { colorMode, toggleColorMode } = useColorMode();

  const [activatingConnector, setActivatingConnector] = useState<
    AbstractConnector
  >();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector)
      setActivatingConnector(undefined);
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);

  const currentConnector = injected;
  const connected = currentConnector === connector;
  const disabled = connected || !!error;

  const MenuItem = ({ children }: any) => (
    <Text
      color="black.100"
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

  // useEffect(() => {
  //   (async () => {
  //     if (active) {
  //       try {
  //         const profile = await ThreeBox.getProfile(account);
  //         if (profile.image) {
  //           let image = profile.image[0]["contentUrl"]["/"];
  //           setImage(image);
  //         }
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   })();
  // }, [active, account]);

  const Image = styled.img`
    display: inline-block;
    border: 0.2rem solid white.100;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  `;

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="0.75rem 1.25rem"
        color="white.100"
        backgroundColor="black.100"
        margin="0 auto"
        minWidth="435px"
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
          <Heading as="h1" size="lg">
            MagicBet
          </Heading>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end">
          {/* <IconButton
            aria-label={`Switch to ${
              colorMode === "light" ? "dark" : "light"
            } mode`}
            variant="ghost"
            color="current"
            mr="2"
            fontSize="20px"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? "moon" : "sun"}
          /> */}
          <Link
            background="none"
            marginRight="1rem"
            cursor="pointer"
            href="https://github.com/BetTogether"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Github Link"
          >
            <Icon name="githubIcon" size="32px" color="white.100" />
          </Link>

          {active && !error ? (
            <>
              {account !== null && (
                <>
                  {image ? (
                    <>
                      {console.log("image:", image)}
                      <Button
                        backgroundColor="Transparent"
                        backgroundRepeat="no-repeat"
                        border="none"
                        cursor="pointer"
                        overflow="hidden"
                        onClick={() => deactivate()}
                      >
                        <Image
                          src={`https://ipfs.infura.io/ipfs/${image}`}
                          alt="3Box profile picture"
                        />
                      </Button>
                    </>
                  ) : (
                    <Button
                      backgroundColor="red.100"
                      border="1px"
                      borderRadius="4px"
                      borderColor="red.100"
                      color="white.100"
                      cursor="pointer"
                      margin="0"
                      position="relative"
                      transition="all 80ms ease-in-out"
                      width="auto"
                      fontSize="1.1rem"
                      onClick={() => deactivate()}
                    >
                      {shortenAddress(account)}
                    </Button>
                  )}
                </>
              )}
            </>
          ) : (
            <Button
              backgroundColor="red.100"
              border="1px"
              borderRadius="4px"
              borderColor="red.100"
              color="white.100"
              cursor="pointer"
              margin="0"
              position="relative"
              transition="all 80ms ease-in-out"
              width="auto"
              fontSize="1.1rem"
              onClick={() => {
                setActivatingConnector(currentConnector);
                activate(injected);
              }}
            >
              Connect
            </Button>
          )}
          {active && (
            <Box
              display={{ sm: "block", md: "none" }}
              onClick={() => setIsExpanded(!isExpanded)}
              padding="0.625rem"
            >
              {isExpanded ? (
                <Icon name="menuIconOpen" size="32px" color="white.100" />
              ) : (
                <Icon name="menuIconClosed" size="32px" color="white.100" />
              )}
            </Box>
          )}
        </Flex>
      </Flex>
      {isExpanded && (
        <Box
          height="auto"
          width="100%"
          position="absolute"
          backgroundColor="white.100"
          display={{ sm: "block", md: "none" }}
        >
          <Box
            margin="0"
            padding="0"
            borderBottom="1px solid rgba(0, 0, 0, 0.8)"
          >
            <MenuItem>
              <Link
                textTransform="uppercase"
                fontWeight="bold"
                cursor=" pointer"
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
                cursor=" pointer"
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
                cursor=" pointer"
                href="/account"
                onClick={() => setIsExpanded(false)}
              >
                Account
              </Link>
            </MenuItem>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Header;
