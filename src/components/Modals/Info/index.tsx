import React, { useState, useEffect, useContext } from 'react';
import { formatUnits } from '@ethersproject/units';
import { v4 as uuidv4 } from 'uuid';
import { Contract } from '@ethersproject/contracts';
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

import { shortenAddress } from '../../../utils';
import { bgColor7 } from '../../../utils/theme';

interface IOutcome {
    name: string;
    bets: string;
}

interface IProps {
    infoModalToggle: {
        isOpen: boolean;
        onOpen: () => any;
        onClose: () => any;
    };
    marketContract: Contract;
}

const InfoModal = ({ infoModalToggle, marketContract }: IProps): JSX.Element => {
    const { colorMode } = useColorMode();

    const MarketStates = ['WAITING', 'OPEN', 'LOCKED', 'WITHDRAW'];
    const [marketState, setMarketState] = useState<string>('');
    const [pot, setPot] = useState<string>('0');
    const [owner, setOwner] = useState<string>('');
    const [numberOfParticipants, setNumberOfParticipants] = useState<number>(0);
    const [outcomeNamesAndAmounts, setOutcomeNamesAndAmounts] = useState<any>([]);

    useEffect(() => {
        (async () => {
            let isStale = false;

            if (!isStale) {
                try {
                    const state = await marketContract.getCurrentState();
                    setMarketState(MarketStates[state]);
                    setOwner(await marketContract.owner());
                    const numberOfParticipants = await marketContract.getMarketSize();
                    setNumberOfParticipants(numberOfParticipants.toNumber());
                    const _pot = await marketContract.totalBets();
                    const pot = formatUnits(_pot.toString(), 18);
                    setPot(pot);

                    const numberOfOutcomes = await marketContract.numberOfOutcomes();

                    if (numberOfOutcomes !== 0) {
                        let newOutcomesArray = [];
                        for (let i = 0; i < numberOfOutcomes; i++) {
                            let newOutcome: IOutcome = { name: '', bets: '' };

                            newOutcome.name = await marketContract.outcomeNames(i);
                            const numOfBets = await marketContract.totalBetsPerOutcome(i);

                            const hexString = numOfBets.toString();
                            const removedZeros = hexString.replace(/^0+(\d)|(\d)0+$/gm, '$1$2');
                            newOutcome.bets = removedZeros;

                            newOutcomesArray.push(newOutcome);
                        }

                        setOutcomeNamesAndAmounts(newOutcomesArray);
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            return () => {
                isStale = true;
            };
        })();
    }, []);

    return (
        <Modal isOpen={infoModalToggle.isOpen} onClose={infoModalToggle.onClose} isCentered>
            <ModalOverlay>
                <ModalContent bg={bgColor7[colorMode]} borderRadius="0.25rem">
                    <ModalHeader>Market Stats</ModalHeader>
                    <ModalCloseButton onClick={infoModalToggle.onClose} />
                    <ModalBody>
                        <Flex direction="column" align="center">
                            <Heading as="h3" fontSize="1.8rem" fontWeight="400">
                                {shortenAddress(owner) ?? '-'}
                            </Heading>
                            <Text fontSize="0.75rem" m="0 10px 10px">
                                Contract Owner
                            </Text>
                        </Flex>
                        <Flex direction="column" align="center">
                            <Heading as="h3" fontSize="1.8rem" fontWeight="400">
                                {marketState ?? '-'}
                            </Heading>
                            <Text fontSize="0.75rem" m="0 10px 10px">
                                Market State
                            </Text>
                        </Flex>
                        {outcomeNamesAndAmounts &&
                            outcomeNamesAndAmounts.map((outcome: IOutcome) => (
                                <Flex key={uuidv4()} direction="column" align="center">
                                    <Heading as="h3" fontSize="1.8rem" fontWeight="400">
                                        {outcome.bets}
                                    </Heading>
                                    <Text fontSize="0.75rem" m="0 10px 10px">
                                        Bets for {outcome.name}
                                    </Text>
                                </Flex>
                            ))}

                        <Flex direction="column" align="center">
                            <Heading as="h3" fontSize="1.8rem" fontWeight="400">
                                {numberOfParticipants}
                            </Heading>
                            <Text fontSize="0.75rem" m="0 10px 10px">
                                Number of Participants
                            </Text>
                        </Flex>
                        <Flex direction="column" align="center">
                            <Heading as="h3" fontSize="1.8rem" fontWeight="400">
                                {pot}
                            </Heading>
                            <Text fontSize="0.75rem" m="0 10px 10px">
                                Total Pot Size (in Dai)
                            </Text>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    );
};

export default InfoModal;
