import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import {
  Box,
  Flex,
  Heading,
  Switch,
  FormLabel,
  useColorMode,
} from '@chakra-ui/core';

import { injected } from '../../utils/connectors';
import MBMarketFactoryContract from '../../abis/MBMarketFactory.json';
import addresses, { KOVAN_ID } from '../../utils/addresses';
import MBMarketContract from '../../abis/MBMarket.json';

import { bgColor1, color1 } from '../../utils/theme';

import MarketCard from './MarketCard';

const Dashboard = (): JSX.Element => {
  const { library, connector, account } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();

  const [factoryContract, setFactoryContract] = useState<Contract>();
  const [marketContract, setMarketContract] = useState<Contract>();

  useEffect(() => {
    if (!!library) {
      let factoryContract: Contract = new Contract(
        addresses[KOVAN_ID].marketFactory,
        MBMarketFactoryContract.abi,
        library
      );
      setFactoryContract(factoryContract);
    }
  }, [library]);

  useEffect(() => {
    (async () => {
      let isStale = false;

      try {
        if (!isStale && !!library && factoryContract !== undefined) {
          if (factoryContract.provider !== null) {
            const mostRecentAddress = await factoryContract.getMostRecentMarket();
            if (mostRecentAddress !== AddressZero) {
              let providerOrSigner;
              if (connector == injected && account) {
                providerOrSigner = library.getSigner(account);
              } else {
                providerOrSigner = library;
              }

              const marketContract = new Contract(
                mostRecentAddress,
                MBMarketContract.abi,
                providerOrSigner
              );
              //Check if paused
              const isPaused = await marketContract.paused();
              if (isPaused) return;

              setMarketContract(marketContract);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
      return () => {
        isStale = true;
      };
    })();
  }, [factoryContract, library]);

  return (
    <Box bg={bgColor1[colorMode]} pb="1rem" rounded="md">
      <Box
        borderTopRightRadius="0.25rem"
        borderTopLeftRadius="0.25rem"
        bg="primary.100"
        h="0.5rem"
      />
      <Flex
        mb="-1px"
        justifyContent="space-between"
        alignItems="center"
        p="1rem 1.5rem"
      >
        <Heading
          as="h3"
          size="lg"
          fontSize="1.5rem"
          font-weight="500"
          color={color1[colorMode]}
        >
          Dashboard
        </Heading>

        <Flex justify="center" align="center">
          <FormLabel htmlFor="email-alerts">Enable alerts?</FormLabel>
          <Switch id="email-alerts" color="red" />
        </Flex>
      </Flex>

      <Flex
        flexWrap="wrap"
        flexDirection="column"
        justifyContent="center"
        m="0 auto 1rem"
        p="0rem 1rem"
        maxWidth="100%"
      >
        {marketContract && <MarketCard marketContract={marketContract} />}
      </Flex>
    </Box>
  );
};

export default Dashboard;
