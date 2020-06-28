import React, { useState, useEffect, useContext } from 'react';
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
  Spinner,
  useColorMode,
} from '@chakra-ui/core';

import { injected } from '../../utils/connectors';
import MBMarketContract from '../../abis/MBMarket.json';
import { bgColor1, color1 } from '../../utils/theme';
import MarketCard from './MarketCard';
import { ContractContext } from '../../state/contracts/Context';

const Dashboard = (): JSX.Element => {
  const { library, connector, account } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();

  const { contracts } = useContext(ContractContext);
  const FactoryContract = contracts[0];

  const [factoryContract, setFactoryContract] = useState<Contract>();
  const [marketContract, setMarketContract] = useState<Contract>();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!!library) setFactoryContract(FactoryContract.connect(library));
  }, [library]);

  useEffect(() => {
    (async () => {
      let isStale = false;

      try {
        if (!isStale && !!library && factoryContract !== undefined) {
          if (factoryContract.provider !== null) {
            const mostRecentAddress = await factoryContract.mostRecentContract();
            if (mostRecentAddress !== AddressZero) {
              let providerOrSigner;
              if (connector == injected && account)
                providerOrSigner = library.getSigner(account);
              else providerOrSigner = library;

              const marketContract = new Contract(
                mostRecentAddress,
                MBMarketContract.abi,
                providerOrSigner
              );

              const isPaused = await marketContract.paused();
              if (isPaused) return;

              setMarketContract(marketContract);
            }
          }
          setLoading(false);
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

        <Flex justify="center" align="center">
          <FormLabel htmlFor="email-alerts">Enable alerts?</FormLabel>
          <Switch
            id="email-alerts"
            color="red"
            aria-label="Enable email alerts"
          />
        </Flex>
      </Flex>

      <Flex
        wrap="wrap"
        direction="column"
        justify="center"
        m="0 auto 1rem"
        p="0rem 1rem"
        maxW="100%"
      >
        {loading ? (
          <Spinner />
        ) : marketContract ? (
          <MarketCard marketContract={marketContract} />
        ) : (
          <h1>No Market Available...</h1>
        )}
      </Flex>
    </Box>
  );
};

export default Dashboard;
