import React, { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { providers, Contract } from "ethers";
import {
  Box,
  Flex,
  Heading,
  Switch,
  Button,
  useDisclosure,
  Icon,
  Tooltip,
} from "@chakra-ui/core";

import BTMarketContract from "abis/BTMarket.json";
import IERC20 from "abis/IERC20.json";
import BTMarketFactoryContract from "abis/BTMarketFactory.json";
import MarketCard from "./MarketCard";
import CreateMarket from "components/Modals/CreateMarket";
import addresses, { KOVAN_ID } from "utils/addresses";
import { useContract } from "utils/hooks";
import { mintDai } from "utils";
import { ModalContext } from "state/modals/Context";

const Dashboard = () => {
  const daiAddress = addresses[KOVAN_ID].tokens.DAI;
  const factoryAddress = addresses[KOVAN_ID].marketFactory;
  const { active } = useWeb3React<Web3Provider>();
  const factoryContract = useContract(
    factoryAddress,
    BTMarketFactoryContract.abi,
    true
  );
  const daiContract = useContract(daiAddress, IERC20.abi, true);
  const provider = new providers.Web3Provider(window.web3.currentProvider);
  const wallet = provider.getSigner();

  const { modalState, modalDispatch } = useContext(ModalContext);

  const [checked, setChecked] = useState(false);
  const [marketContract, setMarketContract] = useState<Contract>();
  const [newMarketAddress, setNewMarketAddress] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (factoryContract)
    factoryContract.on("MarketCreated", (address: any) =>
      setNewMarketAddress(address)
    );

  useEffect(() => {
    (async () => {
      if (factoryContract) {
        try {
          let deployedMarkets = await factoryContract.getMarkets();
          if (deployedMarkets.length !== 0) {
            let marketContractAddress: string =
              deployedMarkets[deployedMarkets.length - 1];

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
      <Box backgroundColor="white.100" paddingBottom="1rem">
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
            <Switch color="red" size="lg" />
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
              onClick={() =>
                modalDispatch({
                  type: "TOGGLE_CREATE_MARKET_MODAL",
                  payload: !modalState.createMarketModalIsOpen,
                })
              }
            >
              Create Market
            </Button>
          )}

          {active && (
            <Button
              backgroundColor="red.100"
              position="fixed"
              bottom="0"
              right="0"
              fontWeight="700"
              color="white.100"
              margin="2rem"
              cursor="pointer"
              padding="0"
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
