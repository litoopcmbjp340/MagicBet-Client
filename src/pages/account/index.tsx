import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
// import Box from "3box";

import BoxLogo from "assets/threebox.svg";
import styled from "@emotion/styled";
import { Box, Flex, Heading, Text } from "@chakra-ui/core";

export const ThreeBoxLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  background-color: gray.100;
  width: 20rem;
`;

export const LogoImage = styled.img`
  margin-left: 0.5rem;
  height: 6rem;
  width: 6rem;
`;

const Account = () => {
  const { active, account } = useWeb3React<Web3Provider>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [box, setBox] = useState("");

  // useEffect(() => {
  //   (async () => {
  //     if (active) {
  //       const profile = await Box.getProfile(account);
  //       setName(profile.name);
  //       const boxProvider = await Box.get3idConnectProvider();
  //       const box = await Box.openBox(account, boxProvider);
  //       console.log("box:", box);
  //       setBox(box);
  //       await box.syncDone;
  //       const email = await box.private.get("email");
  //       console.log("email:", email);
  //       setEmail(email);
  //     }
  //   })();
  // }, [active, account]);

  return (
    <Box
      backgroundColor="white.100"
      borderTopWidth="1px"
      borderBottomWidth="1px"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      paddingBottom="1rem"
    >
      <Box borderBottomWidth="1px">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          padding="1rem 1.5rem"
        >
          <Heading as="h3" fontSize="1.5rem" fontWeight="500" color="black.100">
            Account
          </Heading>
        </Flex>
        {active && (
          <>
            {box ? (
              <Flex
                flexWrap="wrap"
                flexDirection="column"
                justifyContent="center"
                margin="0 auto 1rem"
                maxWidth="100%"
                padding="0rem 1rem"
              >
                <Flex
                  flexDirection="column"
                  alignItems="flex-start"
                  justifyContent="center"
                  margin="0 0.75rem"
                >
                  <Heading
                    as="h2"
                    color="red.100"
                    fontSize="1.4rem"
                    fontWeight="800"
                    margin="0"
                  >
                    {name}
                  </Heading>
                  <Text
                    color="gray.100"
                    fontSize="1rem"
                    fontWeight="600"
                    lineHeight="1.2rem"
                    margin="0"
                    textAlign="left"
                  >
                    {account}
                  </Text>
                  <Text
                    color="gray.100"
                    fontSize="1rem"
                    fontWeight="600"
                    lineHeight="1.2rem"
                    margin="0"
                    textAlign="left"
                  >
                    {email}
                  </Text>
                </Flex>
              </Flex>
            ) : (
              <Flex justifyContent="center" alignItems="center">
                <ThreeBoxLink
                  href="https://3box.io/hub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Help grow the next web with
                  <LogoImage src={BoxLogo} alt="3Box logo" />
                </ThreeBoxLink>
              </Flex>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Account;
