import React from 'react';
import { Flex, Button, useColorMode } from '@chakra-ui/core';

import { bgColor6 } from '../../../utils/theme';

const OwnerFunctionality = ({ marketContract }: any) => {
  const { colorMode } = useColorMode();

  return (
    <Flex justifyContent="center" flexDirection="column" mt="1rem">
      <Button
        my="0.25rem"
        color="light.100"
        textAlign="center"
        text-decoration="none"
        bg={bgColor6[colorMode]}
        _hover={{ bg: 'primary.100' }}
        onClick={async () => await marketContract.incrementState()}
      >
        Increment Market State
      </Button>
      <Button
        my="0.25rem"
        color="light.100"
        textAlign="center"
        text-decoration="none"
        bg={bgColor6[colorMode]}
        _hover={{ bg: 'primary.100' }}
        onClick={async () => await marketContract.determineWinner()}
      >
        Get Winner from Oracle
      </Button>
      <Button
        my="0.25rem"
        color="light.100"
        textAlign="center"
        text-decoration="none"
        bg={bgColor6[colorMode]}
        _hover={{ bg: 'primary.100' }}
        onClick={async () => await marketContract.disableContract()}
      >
        Pause (Disable) Contract
      </Button>
    </Flex>
  );
};

export default OwnerFunctionality;
