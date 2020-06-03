import React from "react";
import { Flex, Button } from "@chakra-ui/core";

const OwnerFunctionality = ({ marketContract }: any) => {
  return (
    <Flex justifyContent="center" flexDirection="column" mt="1rem">
      <Button
        my="0.25rem"
        backgroundColor="dark.100"
        color="light.100"
        textAlign="center"
        text-decoration="none"
        font-size="1rem"
        _hover={{ bg: "primary.100" }}
        onClick={async () => await marketContract.incrementState()}
      >
        Increment Market State
      </Button>
      <Button
        my="0.25rem"
        backgroundColor="dark.100"
        color="light.100"
        textAlign="center"
        text-decoration="none"
        font-size="1rem"
        _hover={{ bg: "primary.100" }}
        onClick={async () => await marketContract.determineWinner()}
      >
        Get Winner from Oracle
      </Button>
      <Button
        my="0.25rem"
        backgroundColor="dark.100"
        color="light.100"
        textAlign="center"
        text-decoration="none"
        font-size="1rem"
        _hover={{ bg: "primary.100" }}
        onClick={async () => await marketContract.disableContract()}
      >
        Pause (Disable) Contract
      </Button>
    </Flex>
  );
};

export default OwnerFunctionality;
