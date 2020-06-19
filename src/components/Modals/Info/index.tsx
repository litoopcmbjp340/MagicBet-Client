import React, { useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

import { formatUnits } from '@ethersproject/units';
import { v4 as uuidv4 } from 'uuid';
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
} from '@chakra-ui/core';

import { shortenAddress } from 'utils';
import { useFactoryContract } from 'hooks/useHelperContract';
import MBMarketContract from 'abis/MBMarket.json';
import { bgColor7 } from 'utils/theme';

interface IOutcome {
  name: string;
  bets: string;
}

const InfoModal = ({ infoModalToggle }: any): JSX.Element => {
  const factoryContract = useFactoryContract();
  const { colorMode } = useColorMode();

  const MarketStates = ['SETUP', 'WAITING', 'OPEN', 'LOCKED', 'WITHDRAW'];
  const [marketState, setMarketState] = useState<string>('');
  const [pot, setPot] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [numberOfParticipants, setNumberOfParticipants] = useState<number>(0);
  const [outcomeNamesAndAmounts, setOutcomeNamesAndAmounts] = useState<any>([]);

  useEffect(() => {
    let isStale = false;
    const fetchData = async () => {
      if (factoryContract && !isStale) {
        try {
          const provider = new Web3Provider(window.web3.currentProvider);

          const deployedMarkets = await factoryContract.getMarkets();
          const mostRecentlyDeployedAddress =
            deployedMarkets[deployedMarkets.length - 1];

          if (deployedMarkets.length !== 0) {
            const marketContract = new Contract(
              mostRecentlyDeployedAddress,
              MBMarketContract.abi,
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
            setPot(formatUnits(_pot.toString(), 18));

            const numberOfOutcomes = await marketContract.numberOfOutcomes();

            if (numberOfOutcomes !== 0) {
              let newOutcomesArray = [];
              for (let i = 0; i < numberOfOutcomes; i++) {
                let newOutcome: IOutcome = { name: '', bets: '' };

                newOutcome.name = await marketContract.outcomeNames(i);
                const numOfBets = await marketContract.totalBetsPerOutcome(i);

                const hexString = numOfBets.toString();
                const removedZeros = hexString.replace(
                  /^0+(\d)|(\d)0+$/gm,
                  '$1$2'
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
      isStale = true;
    };
    //eslint-disable-next-line
  }, []);

  return (
    <Modal
      isOpen={infoModalToggle.isOpen}
      onClose={infoModalToggle.onClose}
      isCentered
    >
      <ModalOverlay />

      <ModalContent bg={bgColor7[colorMode]} borderRadius="0.25rem">
        <ModalHeader>Market Stats</ModalHeader>
        <ModalCloseButton onClick={infoModalToggle.onClose} />
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
