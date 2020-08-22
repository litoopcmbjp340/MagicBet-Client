import React, { useState, useEffect, useContext } from 'react';
import { Flex, Box, Heading, useColorMode, Skeleton } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import styled from '@emotion/styled';

import Market from './Market';
import MBMarketFactoryContract from '../../abis/MBMarketFactory.json';
import addresses, { KOVAN_ID } from '../../utils/addresses';
import { bgColor1, color1 } from '../../utils/theme';
import { useContract } from '../../hooks';
import { ContractContext } from '../../state/contracts/Context';

const Table = styled.table`
    width: 100%;
`;

const TableBody = styled.tbody``;

const TableHeadTop = styled.thead``;

const TableRow = styled.tr<{ colorMode: string }>`
    background-color: ${(props) => (props.colorMode === 'light' ? '#f4f5f9' : '#777')};
    border-bottom: 1px solid ${(props) => (props.colorMode === 'light' ? '#252c41' : '#121212')};
`;

const TableHead = styled.th<{
    roundedLeft?: boolean;
    roundedRight?: boolean;
    colorMode?: string;
}>`
    border-bottom: 1px solid #ddd;
    background-color: ${(props) => (props.colorMode === 'light' ? '#252c41' : '#121212')};
    color: #f4f5f9;
    border-top-left-radius: ${(props) => (props.roundedLeft ? '0.5rem' : 0)};
    border-top-right-radius: ${(props) => (props.roundedRight ? '0.5rem' : 0)};
`;

const Markets = (): JSX.Element => {
    const { library, account } = useWeb3React<Web3Provider>();
    const { colorMode } = useColorMode();
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { contracts } = useContext(ContractContext);

    useEffect(() => {
        if (!!library && !!account) {
            let isStale = false;
            const factoryInstance = contracts[0].connect(library);

            if (!isStale) {
                factoryInstance
                    .getMarkets()
                    .then((markets: any) => setMarkets(markets))
                    .catch((error: Error) => console.error(error));
            }
            setLoading(false);

            return () => {
                isStale = true;
                setMarkets([]);
            };
        }
    }, [library]);

    return (
        <Box bg={bgColor1[colorMode]} my="2rem" rounded="md" boxShadow="md">
            <Box roundedTop="0.25rem" bg="primary.100" h="0.5rem" />
            <Flex direction="column" wrap="wrap" justify="space-between" m="0 auto" w="100%" p="1rem 1.5rem">
                <Heading as="h3" size="lg" fontSize="1.5rem" fontWeight="500" color={color1[colorMode]}>
                    Markets
                </Heading>

                <Box mt="1rem">
                    <Skeleton isLoaded={!loading}>
                        <Table>
                            <TableHeadTop>
                                <TableRow colorMode={colorMode}>
                                    <TableHead colorMode={colorMode} roundedLeft>
                                        Address
                                    </TableHead>
                                    <TableHead colorMode={colorMode}>Question</TableHead>
                                    <TableHead colorMode={colorMode}>Winning Outcome</TableHead>
                                    <TableHead colorMode={colorMode}>Winnings</TableHead>
                                    <TableHead colorMode={colorMode} roundedRight>
                                        Finish Date
                                    </TableHead>
                                </TableRow>
                            </TableHeadTop>
                            <TableBody>
                                {markets.length > 0 &&
                                    markets.map((market: string) => {
                                        return (
                                            <TableRow colorMode={colorMode} key={market}>
                                                <Market market={market} />
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </Skeleton>
                </Box>
            </Flex>
        </Box>
    );
};

export default Markets;
