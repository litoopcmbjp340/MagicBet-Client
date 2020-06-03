import React, { useState, useEffect, useContext } from "react";
import { providers, utils, Contract } from "ethers";
import { v4 as uuidv4 } from "uuid";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Heading,
  useColorMode,
} from "@chakra-ui/core";

import { ModalContext } from "state/modals/Context";
import { shortenAddress } from "utils";
import { useFactoryContract } from "hooks/useHelperContract";
import BTMarketContract from "abis/BTMarket.json";
import { bgColorModal } from "theme";

interface IOutcome {
  name: string;
  bets: string;
}

const InfoModal = ({ isOpen }: { isOpen: boolean }): JSX.Element => {
  const factoryContract = useFactoryContract();
  const { colorMode } = useColorMode();

  const { modalState, modalDispatch } = useContext(ModalContext);

  const MarketStates = ["SETUP", "WAITING", "OPEN", "LOCKED", "WITHDRAW"];
  const [marketState, setMarketState] = useState<string>("");
  const [pot, setPot] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [numberOfParticipants, setNumberOfParticipants] = useState<number>(0);
  const [outcomeNamesAndAmounts, setOutcomeNamesAndAmounts] = useState<any>([]);

  useEffect(() => {
    let isExpired = false;
    const fetchData = async () => {
      if (factoryContract && !isExpired) {
        try {
          const provider = new providers.Web3Provider(
            window.web3.currentProvider
          );

          const deployedMarkets = await factoryContract.getMarkets();
          const mostRecentlyDeployedAddress =
            deployedMarkets[deployedMarkets.length - 1];

          if (deployedMarkets.length !== 0) {
            const marketContract = new Contract(
              mostRecentlyDeployedAddress,
              BTMarketContract.abi,
              provider
            );

            const [
              _marketState,
              _owner,
              _numberOfParticipants,
              _pot,
            ] = await Promise.all([
              marketContract.state(),
              marketContract.owner(),
              marketContract.getMarketSize(),
              marketContract.totalBets(),
            ]);
            setMarketState(MarketStates[_marketState]);
            setOwner(_owner);
            setNumberOfParticipants(_numberOfParticipants.toNumber());
            setPot(utils.formatUnits(_pot.toString(), 18));

            const numberOfOutcomes = await marketContract.numberOfOutcomes();

            if (numberOfOutcomes !== 0) {
              let newOutcomesArray = [];
              for (let i = 0; i < numberOfOutcomes; i++) {
                let newOutcome: IOutcome = { name: "", bets: "" };

                newOutcome.name = await marketContract.outcomeNames(i);
                const numOfBets = await marketContract.totalBetsPerOutcome(i);

                const hexString = numOfBets.toString();
                const removedZeros = hexString.replace(
                  /^0+(\d)|(\d)0+$/gm,
                  "$1$2"
                );
                newOutcome.bets = removedZeros;

                newOutcomesArray.push(newOutcome);
              }
              setOutcomeNamesAndAmounts(newOutcomesArray);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();

    return () => {
      isExpired = true;
    };
    //eslint-disable-next-line
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() =>
        modalDispatch({
          type: "TOGGLE_INFO_MODAL",
          payload: !modalState.infoModalIsOpen,
        })
      }
      isCentered
    >
      <ModalOverlay />

      <ModalContent bg={bgColorModal[colorMode]} borderRadius="0.25rem">
        <ModalHeader>Market Stats</ModalHeader>
        <ModalCloseButton
          onClick={() =>
            modalDispatch({
              type: "TOGGLE_INFO_MODAL",
              payload: !modalState.infoModalIsOpen,
            })
          }
        />
        <ModalBody>
          <Flex flexDirection="column" alignItems="center">
            <Heading
              as="h3"
              fontSize="1.8rem"
              fontWeight="400"
              lineHeight=" 2rem"
              margin="0"
              padding="0"
            >
              {shortenAddress(owner)}
            </Heading>
            <Text
              fontSize="0.75rem"
              lineHeight="1.5"
              margin="0 0 10px"
              padding="0"
            >
              Contract Owner
            </Text>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Heading
              as="h3"
              fontSize="1.8rem"
              fontWeight="400"
              lineHeight=" 2rem"
              margin="0"
              padding="0"
            >
              {marketState}
            </Heading>
            <Text
              fontSize="0.75rem"
              lineHeight="1.5"
              margin="0 0 10px"
              padding="0"
            >
              Market State
            </Text>
          </Flex>
          {outcomeNamesAndAmounts &&
            outcomeNamesAndAmounts.map((outcome: IOutcome) => (
              <Flex key={uuidv4()} flexDirection="column" alignItems="center">
                <Heading
                  as="h3"
                  fontSize="1.8rem"
                  fontWeight="400"
                  lineHeight=" 2rem"
                  margin="0"
                  padding="0"
                >
                  {outcome.bets}
                </Heading>
                <Text
                  fontSize="0.75rem"
                  lineHeight="1.5"
                  margin="0 0 10px"
                  padding="0"
                >
                  Bets for {outcome.name}
                </Text>
              </Flex>
            ))}

          <Flex flexDirection="column" alignItems="center">
            <Heading
              as="h3"
              fontSize="1.8rem"
              fontWeight="400"
              lineHeight=" 2rem"
              margin="0"
              padding="0"
            >
              {numberOfParticipants}
            </Heading>
            <Text
              fontSize="0.75rem"
              lineHeight="1.5"
              margin="0 0 10px"
              padding="0"
            >
              Number of Participants
            </Text>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Heading
              as="h3"
              fontSize="1.8rem"
              fontWeight="400"
              lineHeight=" 2rem"
              margin="0"
              padding="0"
            >
              {pot}
            </Heading>
            <Text
              fontSize="0.75rem"
              lineHeight="1.5"
              margin="0 0 10px"
              padding="0"
            >
              Total Pot Size (in Dai)
            </Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InfoModal;
