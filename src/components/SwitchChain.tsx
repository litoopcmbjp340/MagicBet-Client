import React from "react";
import { Flex, Stack, Text } from "@chakra-ui/core";
// import { useWeb3React } from "@web3-react/core";

// import { getEthNetworkNameById } from "utils";

export default function SwitchChain({
  requiredChainId,
}: {
  requiredChainId: number;
}): JSX.Element {
  // const { chainId } = useWeb3React();

  return (
    <Flex
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor="light.100"
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
