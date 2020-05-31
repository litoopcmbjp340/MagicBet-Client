import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import BTMarketFactoryContract from "abis/BTMarketFactory.json";

import addresses, { KOVAN_ID } from "utils/addresses";
import { useContract } from "utils/hooks";
import CreateMarket from "components/Modals/CreateMarket";
import { mintDai } from "utils";

import DaiIcon from "assets/dai.svg";
import { providers, Contract } from "ethers";
import {
  Box,
  Flex,
  Heading,
  Switch,
  Button,
  useDisclosure,
  IconButton,
  FormLabel,
  Tooltip,
} from "@chakra-ui/core";

import BTMarketContract from "abis/BTMarket.json";
import IERC20 from "abis/IERC20.json";

import MarketCard from "components/MarketCard";
const daiAddress = addresses[KOVAN_ID].tokens.DAI;

const factoryAddress = addresses[KOVAN_ID].marketFactory;

const Dashboard = () => {
  const { active } = useWeb3React<Web3Provider>();
  const factoryContract = useContract(
    factoryAddress,
    BTMarketFactoryContract.abi,
    true
  );
  const daiContract = useContract(daiAddress, IERC20.abi, true);
  const provider = new providers.Web3Provider(window.web3.currentProvider);
  const wallet = provider.getSigner();

  const [checked, setChecked] = useState(false);
  const [marketContract, setMarketContract] = useState<Contract>();
  const [newMarketAddress, setNewMarketAddress] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // factoryContract.on("MarketCreated", (address: any) =>
  //   setNewMarketAddress(address)
  // );

  useEffect(() => {
    (async () => {
      if (factoryContract) {
        try {
          let deployedMarkets = await factoryContract.getMarkets();
          if (deployedMarkets.length !== 0) {
            let marketContractAddress: string =
              deployedMarkets[deployedMarkets.length - 1];

            console.log("marketContractAddress:", marketContractAddress);
            const marketInstance = new Contract(
              marketContractAddress,
              BTMarketContract.abi,
              wallet
            );

            setMarketContract(marketInstance);
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
    //eslint-disable-next-line
  }, [factoryContract]);

  return (
    <>
      <Box
        backgroundColor="white.100"
        borderTopWidth="1px"
        borderBottomWidth="1px"
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
        borderRadius="0.25rem"
        paddingBottom="1rem"
      >
        <Flex
          marginBottom="-1px"
          justifyContent="space-between"
          alignItems="center"
          padding="1rem 1.5rem"
        >
          <Heading
            as="h3"
            size="lg"
            fontSize="1.5rem"
            font-weight="500"
            color="black.100"
          >
            Dashboard
          </Heading>

          <Flex justify="center" align="center">
            {/* <Tooltip
              label="Want an Email Alert?"
              aria-label="send an email alert"
            > */}
            <Switch color="red.100" size="lg" />
            {/* </Tooltip> */}
          </Flex>
        </Flex>

        <Flex
          flexWrap="wrap"
          flexDirection="column"
          justifyContent="center"
          margin="0 auto 1rem"
          maxWidth="100%"
          padding="0rem 1rem"
        >
          {marketContract ? (
            <MarketCard
              marketContract={marketContract}
              daiContract={daiContract}
            />
          ) : (
            <Button
              backgroundColor="black.100"
              border="none"
              borderRadius="0.33rem"
              color="white.100"
              text-Align="center"
              fontSize="1rem"
              padding="0.8rem"
              width="auto"
              cursor="pointer"
              _hover={{ bg: "red.100" }}
              isDisabled={!active}
              onClick={() => onOpen()}
            >
              Create Market
            </Button>
          )}

          {active && (
            <IconButton
              aria-label="market info"
              icon="add"
              position="fixed"
              cursor="pointer"
              bottom="0"
              right="0"
              borderRadius="0.25rem"
              alignItems="center"
              fontWeight="700"
              color="white.100"
              backgroundColor="red.100"
              margin="2rem"
              onClick={() => mintDai(wallet)}
            />
          )}
        </Flex>
      </Box>
      <CreateMarket isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Dashboard;
