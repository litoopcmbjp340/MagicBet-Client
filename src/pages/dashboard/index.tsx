import React, { useState, useEffect, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { AddressZero } from '@ethersproject/constants';
import {
  Box,
  Flex,
  Heading,
  Switch,
  FormLabel,
  useColorMode,
} from '@chakra-ui/core';

//import { injected } from '../../utils/connectors';

import { bgColor1, color1 } from '../../utils/theme';
import MarketCard from './MarketCard';
import { ContractContext } from '../../state/contracts/Context';

const Dashboard = (): JSX.Element => {
  const { contracts } = useContext(ContractContext);
  const [marketContractAddress, setMarketContractAddress] = useState<string>(
    ''
  );

  const { library, account, connector } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!!library && !!account) {
      let isStale = false;
      const factoryInstance = contracts[0].connect(library);

      if (!isStale) {
        factoryInstance
          .mostRecentContract()
          .then((mostRecentAddress: string) => {
            if (mostRecentAddress !== AddressZero)
              setMarketContractAddress(mostRecentAddress);
          });
      }

      return () => {
        isStale = true;
      };
    }
  }, [library]);

  return (
    <Box bg={bgColor1[colorMode]} pb="1rem" rounded="md" boxShadow="md">
      <Box roundedTop="0.25rem" bg="primary.100" h="0.5rem" />
      <Flex justify="space-between" align="center" p="1rem 1.5rem">
        <Heading
          as="h3"
          size="lg"
          fontSize="1.5rem"
          font-weight="500"
          color={color1[colorMode]}
        >
          Dashboard
        </Heading>

        <Box>
          <FormLabel htmlFor="email-alerts">Enable alerts?</FormLabel>
          <Switch
            id="email-alerts"
            color="red"
            aria-label="Enable email alerts"
          />
        </Box>
      </Flex>

      <Flex
        wrap="wrap"
        direction="column"
        justify="center"
        m="0 auto 1rem"
        p="0rem 1rem"
        maxW="100%"
      >
        {!!marketContractAddress ? (
          <MarketCard marketContractAddress={marketContractAddress} />
        ) : (
          <h1>No Market Available...</h1>
        )}
      </Flex>
    </Box>
  );
};

export default Dashboard;
