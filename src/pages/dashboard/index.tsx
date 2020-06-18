import React, { useState, useEffect, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import {
  Box,
  Flex,
  Heading,
  Switch,
  Button,
  Icon,
  FormLabel,
  useColorMode,
} from '@chakra-ui/core';

import BTMarketContract from '../../abis/BTMarket.json';
import MarketCard from './MarketCard';
import CreateMarket from '../../components/Modals/CreateMarket';
import { mintDai } from '../../utils';
import { ModalContext } from '../../state/modals/Context';
import {
  getMostRecentAddress,
  useFactoryContract,
  useDaiContract,
} from '../../hooks/useHelperContract';
import { bgColor1, color1, bgColor6 } from '../../utils/theme';

const Dashboard = (): JSX.Element => {
  const { active } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();
  const factoryContract = useFactoryContract();
  const daiContract = useDaiContract();
  //@ts-ignore
  const provider = new Web3Provider(window.web3.currentProvider);
  const wallet = provider.getSigner();

  const { modalState, modalDispatch } = useContext(ModalContext);

  //const [checked, setChecked] = useState<boolean>(false);
  const [marketContract, setMarketContract] = useState<Contract>();

  const [newMarketAddress, setNewMarketAddress] = useState<any>();

  if (factoryContract)
    factoryContract.on('MarketCreated', (address: any) =>
      setNewMarketAddress(address)
    );

  useEffect(() => {
    (async () => {
      let isStale = false;
      try {
        if (factoryContract && !isStale) {
          const deployedMarkets = await factoryContract.getMarkets();
          if (deployedMarkets.length !== 0) {
            const marketContractAddress = await getMostRecentAddress(
              factoryContract
            );

            const marketInstance = new Contract(
              marketContractAddress,
              BTMarketContract.abi,
              wallet
            );

            setMarketContract(marketInstance);
          }
        }
      } catch (error) {
        console.error(error);
      }
      return () => {
        isStale = true;
      };
    })();

    //eslint-disable-next-line
  }, [factoryContract]);

  return (
    <>
      <Box
        borderTopRightRadius="1rem"
        borderTopLeftRadius="1rem"
        bg="primary.100"
        h="0.5rem"
      />
      <Box bg={bgColor1[colorMode]} paddingBottom="1rem">
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
          maxWidth="100%"
          p="0rem 1rem"
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
              onClick={() =>
                modalDispatch({
                  type: 'TOGGLE_CREATE_MARKET_MODAL',
                  payload: !modalState.createMarketModalIsOpen,
                })
              }
            >
              Create Market
            </Button>
          )}

          {active && (
            <Button
              backgroundColor="primary.100"
              position="fixed"
              bottom="0"
              right="0"
              fontWeight="700"
              color="light.100"
              m="2rem"
              cursor="pointer"
              p="0"
              onClick={() => mintDai(wallet)}
            >
              <Icon name="daiIcon" color="white.200" size="1.5rem" />
            </Button>
          )}
        </Flex>
      </Box>
      <CreateMarket isOpen={modalState.createMarketModalIsOpen} />
    </>
  );
};

export default Dashboard;
