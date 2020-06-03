import React from "react";
import { Flex, Stack, Text, useColorMode } from "@chakra-ui/core";
// import { useWeb3React } from "@web3-react/core";

// import { getEthNetworkNameById } from "utils";
import { bgColor } from "theme";

export default function SwitchChain({
  requiredChainId,
}: {
  requiredChainId: number;
}): JSX.Element {
  // const { chainId } = useWeb3React();
  const { colorMode } = useColorMode();

  return (
    <Flex
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={bgColor[colorMode]}
      paddingBottom="1rem"
    >
      <Stack direction="column" alignItems="center">
        <Text fontSize="1.5rem">
          {/* You are currently connected to {getEthNetworkNameById(chainId)} */}
          Wrong Network
        </Text>
        <Text fontSize="1.5rem">
          Please connect to {requiredChainId === 42 && "Kovan"}
        </Text>
      </Stack>
    </Flex>
  );
}
