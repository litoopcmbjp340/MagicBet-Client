import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Box from "3box";
import {
  Box as ChakraBox,
  Flex,
  Heading,
  Text,
  Button,
  Link,
} from "@chakra-ui/core";

const Account = () => {
  const { active, account } = useWeb3React<Web3Provider>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [box, setBox] = useState("");

  useEffect(() => {
    (async () => {
      if (active) {
        const profile = await Box.getProfile(account);
        setName(profile.name);
        const boxProvider = await Box.get3idConnectProvider();
        const box = await Box.openBox(account, boxProvider);
        console.log("box:", box);
        setBox(box);
        await box.syncDone;
        const email = await box.private.get("email");
        console.log("email:", email);
        setEmail(email);
      }
    })();
  }, [active, account]);

  return (
    <ChakraBox backgroundColor="light.100" paddingBottom="1rem">
      <ChakraBox>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          padding="1rem 1.5rem"
        >
          <Heading as="h3" fontSize="1.5rem" fontWeight="500" color="dark.100">
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
                    color="primary.100"
                    fontSize="1.4rem"
                    fontWeight="800"
                    margin="0"
                  >
                    {name}
                  </Heading>
                  <Text
                    color="secondary.100"
                    fontSize="1rem"
                    fontWeight="600"
                    lineHeight="1.2rem"
                    margin="0"
                    textAlign="left"
                  >
                    {account}
                  </Text>
                  <Text
                    color="secondary.100"
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
              <Button ml="2rem">
                <Link
                  href="https://3box.io/hub"
                  isExternal
                  rel="noopener noreferrer"
                >
                  <Text>Help Grow Web3...</Text>
                </Link>
              </Button>
            )}
          </>
        )}
      </ChakraBox>
    </ChakraBox>
  );
};

export default Account;
