import React, { useState, useEffect, useContext } from "react";
import { ContractContext } from "state/contracts/Context";
import { providers, utils, Contract } from "ethers";
import { v4 as uuidv4 } from "uuid";

import { shortenAddress } from "utils";
import BTMarketContract from "abis/BTMarket.json";
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

import BTMarketFactoryContract from "abis/BTMarketFactory.json";
import addresses, { KOVAN_ID } from "utils/addresses";

import { useContract } from "utils/hooks";

interface IOutcomeObject {
  name: string;
  bets: number;
}

interface ICreateMarketModal {
  isOpen: boolean;
  onClose: () => void;
}

const factoryAddress = addresses[KOVAN_ID].marketFactory;

const InfoModal = ({ isOpen, onClose }: ICreateMarketModal) => {
  const factoryContract = useContract(
    factoryAddress,
    BTMarketFactoryContract.abi,
    true
  );

  const MarketStates = ["SETUP", "WAITING", "OPEN", "LOCKED", "WITHDRAW"];
  const [marketState, setMarketState] = useState<string>("");
  const [pot, setPot] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [numberOfParticipants, setNumberOfParticipants] = useState<number>(0);
  const [outcomeNamesAndAmounts, setOutcomeNamesAndAmounts] = useState<any>([]);

  useEffect(() => {
    (async () => {
      if (factoryContract) {
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

          const marketState = await marketContract.state();
          setMarketState(MarketStates[marketState]);
          const owner = await marketContract.owner();
          setOwner(owner);
          const numberOfParticipants = await marketContract.getMarketSize();
          setNumberOfParticipants(numberOfParticipants.toNumber());
          const pot = await marketContract.totalBets();
          setPot(utils.formatUnits(pot.toString(), 18));

          let numberOfOutcomes = await marketContract.numberOfOutcomes();

          if (numberOfOutcomes !== 0) {
            let newOutcomesArray = [];
            for (let i = 0; i < numberOfOutcomes; i++) {
              let newOutcome: IOutcomeObject = { name: "", bets: 0 };

              const outcomeName = await marketContract.outcomeNames(i);
              newOutcome.name = outcomeName;

              //outcome bets
              const numberOfBets = await marketContract.totalBetsPerOutcome(i);
              const fortmatted = utils.formatUnits(numberOfBets, 18);
              const float = parseFloat(fortmatted);
              const bet = Math.ceil(float);
              newOutcome.bets = bet;
              newOutcomesArray.push(newOutcome);
            }
            setOutcomeNamesAndAmounts(newOutcomesArray);
          }
        }
      }
    })();
  }, [MarketStates, factoryContract]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor="white.100" borderRadius="0.25rem">
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
