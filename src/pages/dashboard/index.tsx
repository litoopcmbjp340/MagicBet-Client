import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import {
  Box,
  Flex,
  Heading,
  Switch,
  Button,
  FormLabel,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/core';

import MBMarketContract from '../../abis/MBMarket.json';
import MarketCard from './MarketCard';
import CreateMarket from '../../components/Modals/CreateMarket';
import {
  getMostRecentAddress,
  useFactoryContract,
  useDaiContract,
} from '../../hooks/useHelperContract';
import { bgColor1, color1, bgColor6 } from '../../utils/theme';

const Dashboard = (): JSX.Element => {
  const { active, account, library } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();
  const factoryContract = useFactoryContract();
  const daiContract = useDaiContract();

  const createMarketModalToggle = useDisclosure();

  const [marketContract, setMarketContract] = useState<Contract>();
  let wallet: any;

  useEffect(() => {
    (async () => {
      let isStale = false;

      try {
        if (factoryContract && !isStale) {
          if (!!library && !!account)
            // connectUnchecked()
            wallet = library.getSigner(account);

          const deployedMarkets = await factoryContract.getMarkets();
          if (deployedMarkets.length !== 0) {
            const marketContractAddress = await getMostRecentAddress(
              factoryContract
            );

            const marketInstance = new Contract(
              marketContractAddress,
              MBMarketContract.abi,
              wallet
            );

            const isPaused = await marketInstance.paused();
            if (isPaused) return;
            else setMarketContract(marketInstance);
          }

          factoryContract.on('MarketCreated', (address: any) => {
            const marketInstance = new Contract(
              address,
              MBMarketContract.abi,
              wallet
            );
            setMarketContract(marketInstance);
          });
        }
      } catch (error) {
        console.error(error);
      }
      return () => {
        isStale = true;
      };
    })();
  }, [factoryContract]);

  return (
    <>
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
          {marketContract ? (
            <MarketCard
              marketContract={marketContract}
              daiContract={daiContract}
            />
          ) : (
            <Button
              bg={bgColor6[colorMode]}
              border="none"
              borderRadius="0.33rem"
              color="light.100"
              text-Align="center"
              fontSize="1rem"
              p="0.8rem"
              w="auto"
              cursor="pointer"
              _hover={{ bg: 'primary.100' }}
              isDisabled={!active}
              onClick={createMarketModalToggle.onOpen}
            >
              Create Market
            </Button>
          )}
        </Flex>
      </Box>
      <CreateMarket createMarketModalToggle={createMarketModalToggle} />
    </>
  );
};

export default Dashboard;
