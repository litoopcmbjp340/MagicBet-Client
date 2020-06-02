import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/core";

import { shortenAddress } from "utils";
import BTMarketContract from "abis/BTMarket.json";
import { useFactoryContract } from "utils/getContract";

interface IOutcomeObject {
  name: string;
  bets: number;
}

interface ICreateMarketModal {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal = ({ isOpen, onClose }: ICreateMarketModal) => {
  const factoryContract = useFactoryContract();

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

          let deployedMarkets = await factoryContract.getMarkets();
          let mostRecentlyDeployedAddress =
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

            let numberOfOutcomes = await marketContract.numberOfOutcomes();
            if (numberOfOutcomes !== 0) {
              let newOutcomesArray = [];
              for (let i = 0; i < numberOfOutcomes; i++) {
                let newOutcome: IOutcomeObject = { name: "", bets: 0 };

                newOutcome.name = await marketContract.outcomeNames(i);

                const numOfBets = await marketContract.totalBetsPerOutcome(i);
                const fortmatted = utils.formatUnits(numOfBets, 18);
                const float = parseFloat(fortmatted);
                newOutcome.bets = Math.ceil(float);

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
  }, [MarketStates, factoryContract]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor="light.100" borderRadius="0.25rem">
        <ModalHeader>Market Stats</ModalHeader>
        <ModalCloseButton />
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
              color="#555"
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
              color="#555"
              fontSize="0.75rem"
              lineHeight="1.5"
              margin="0 0 10px"
              padding="0"
            >
              Market State
            </Text>
          </Flex>
          {outcomeNamesAndAmounts &&
            outcomeNamesAndAmounts.map((outcome: any) => (
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
                  color="#555"
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
              color="#555"
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
              color="#555"
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
