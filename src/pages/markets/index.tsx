import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Flex, Box, Heading, useColorMode, Skeleton, BoxProps, Tag, Text, Link, Icon } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useTable } from 'react-table';
import { v4 as uuidv4 } from 'uuid';

import { shortenAddress, getFormattedNumber } from '../../utils';
import MBMarketContract from '../../abis/MBMarket.json';
import MBMarketFactoryContract from '../../abis/MBMarketFactory.json';
import addresses, { KOVAN_ID } from '../../utils/addresses';
import { bgColor1, color1 } from '../../utils/theme';
import { useContract } from '../../hooks';
import { ContractContext } from '../../state/contracts/Context';

function Table(props: BoxProps) {
    return (
        <Box shadow="sm" rounded="lg" borderWidth="1px" overflowX="auto">
            <Box as="table" width="full" {...props} />
        </Box>
    );
}

function TableHead(props: BoxProps) {
    return <Box as="thead" {...props} />;
}

function TableRow(props: BoxProps) {
    return <Box as="tr" {...props} />;
}

function TableHeader(props: BoxProps) {
    return (
        <Box
            as="th"
            px="6"
            py="3"
            borderBottomWidth="1px"
            textAlign="left"
            fontSize="xs"
            textTransform="uppercase"
            letterSpacing="wider"
            lineHeight="1rem"
            fontWeight="bold"
            {...props}
        />
    );
}

function TableBody(props: BoxProps) {
    return <Box as="tbody" {...props} />;
}

function TableCell(props: BoxProps) {
    return <Box as="td" px="6" py="4" lineHeight="1.25rem" {...props} />;
}

export default function Markets(): JSX.Element {
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

    const [question, setQuestion] = useState<number>(0);
    const [questionId, setQuestionId] = useState<number>(0);
    const [maxInterests, setMaxInterest] = useState<number>(0);
    const [marketResolutionTime, setMarketResolutionTime] = useState<number>(0);
    const [winningOutcome, setWinningOutcome] = useState<number>(0);
    // const marketContract = useContract(market, MBMarketContract.abi);

    // useEffect(() => {
    //     let isStale = false;
    //     (async () => {
    //         try {
    //             if (!isStale) {
    //                 const [
    //                     _question,
    //                     _questionId,
    //                     _maxInterests,
    //                     _marketResolutionTime,
    //                     _winningOutcomeId,
    //                 ] = await Promise.all([
    //                     marketContract.eventName(),
    //                     marketContract.questionId(),
    //                     marketContract.getMaxTotalInterest(),
    //                     marketContract.marketResolutionTime(),
    //                     marketContract.winningOutcome(),
    //                 ]);

    //                 let _winningOutcome;
    //                 if (
    //                     _winningOutcomeId.toString() !==
    //                     '115792089237316195423570985008687907853269984665640564039457584007913129639935'
    //                 ) {
    //                     _winningOutcome = await marketContract.outcomeNames(_winningOutcomeId);
    //                 }

    //                 setQuestion(_question);
    //                 setQuestionId(_questionId);
    //                 setMaxInterest(_maxInterests);
    //                 setMarketResolutionTime(_marketResolutionTime);
    //                 setWinningOutcome(_winningOutcomeId);
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     })();

    //     return () => {
    //         isStale = true;
    //     };
    // }, [market, marketContract]);

    const columns: any = useMemo(
        () => [
            {
                Header: 'Question',
                accessor: 'col1',
            },
            {
                Header: 'Winning Outcome',
                accessor: 'col2',
            },
            {
                Header: 'Winnings',
                accessor: 'col3',
            },
            {
                Header: 'Finish Date',
                accessor: 'col4',
            },
        ],
        [],
    );

    const data: any = [
        {
            col1: 'John Doe',
            col2: '0x1d9999be880e7e516dEefdA00a3919BdDE9C1707',
            col3: 'DAI',
            col4: '1800000000000000000',
        },
        {
            col1: 'John Doe',
            col2: '0x1d9999be880e7e516dEefdA00a3919BdDE9C1707',
            col3: 'DAI',
            col4: '1800000000000000000',
        },
        {
            col1: 'John Doe',
            col2: '0x1d9999be880e7e516dEefdA00a3919BdDE9C1707',
            col3: 'DAI',
            col4: '1800000000000000000',
        },
        {
            col1: 'John Doe',
            col2: '0x1d9999be880e7e516dEefdA00a3919BdDE9C1707',
            col3: 'DAI',
            col4: '1800000000000000000',
        },
        {
            col1: 'John Doe',
            col2: '0x1d9999be880e7e516dEefdA00a3919BdDE9C1707',
            col3: 'DAI',
            col4: '1800000000000000000',
        },
    ];

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <Box bg={bgColor1[colorMode]} my="2rem" borderRadius="md" boxShadow="md">
            <Box borderTopRadius="0.25rem" bg="primary.100" h="0.5rem" />
            <Flex direction="column" wrap="wrap" justify="space-between" m="0 auto" w="100%" p="1rem 1.5rem">
                <Heading as="h1" size="lg" fontSize="1.5rem" fontWeight="500" color={color1[colorMode]}>
                    Markets
                </Heading>

                <Box mt="1rem">
                    <Table {...getTableProps()}>
                        <TableHead>
                            {headerGroups.map((headerGroup: any) => (
                                <TableRow {...headerGroup.getHeaderGroupProps()} key={uuidv4()}>
                                    {headerGroup.headers.map((column: any) => (
                                        <TableHeader {...column.getHeaderProps()} key={uuidv4()}>
                                            {column.render('Header')}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody {...getTableBodyProps()}>
                            {rows.map((row: any) => {
                                prepareRow(row);
                                return (
                                    <TableRow {...row.getRowProps()} key={uuidv4()}>
                                        {row.cells.map((cell: any) => {
                                            return (
                                                <TableCell {...cell.getCellProps()} key={uuidv4()}>
                                                    {cell.render('Cell')}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>
            </Flex>
        </Box>
    );
}
