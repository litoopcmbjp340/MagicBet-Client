import React, { useState, useEffect, useContext } from 'react';
import { Flex, Box, Heading, useColorMode } from '@chakra-ui/core';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Market from './Market';
import MBMarketFactoryContract from '../../abis/MBMarketFactory.json';
import addresses, { KOVAN_ID } from '../../utils/addresses';
import { bgColor1, color1 } from '../../utils/theme';
import { useContract } from '../../hooks';
import {
  Table,
  TableBody,
  TableHeadTop,
  TableRow,
  TableHead,
} from './markets.style';
import { ContractContext } from '../../state/contracts/Context';

const Markets = (): JSX.Element => {
  const { library } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();
  const [markets, setMarkets] = useState([]);
  const [factoryContract, setFactoryContract] = useState();

  const { contracts } = useContext(ContractContext);
  const FactoryContract = contracts[0];

  useEffect(() => {
    if (!!library) setFactoryContract(FactoryContract.connect(library));
  }, [library]);

  useEffect(() => {
    let isStale = false;
    if (!isStale && !!library && factoryContract !== undefined) {
      if (factoryContract.provider !== null) {
        factoryContract
          .getMarkets()
          .then((markets: any) => setMarkets(markets))
          .catch((error: any) => console.error(error));
      }
    }
    return (): void => {
      isStale = true;
    };
  }, [factoryContract]);

  return (
    <Box bg={bgColor1[colorMode]} m="0" pb="1rem" rounded="md" boxShadow="md">
      <Box roundedTop="0.25rem" bg="primary.100" h="0.5rem" />
      <Flex
        direction="column"
        wrap="wrap"
        justify="space-between"
        m="0 auto"
        w="100%"
        p="1rem 1.5rem"
      >
        <Heading
          as="h3"
          size="lg"
          fontSize="1.5rem"
          font-weight="500"
          color={color1[colorMode]}
        >
          Markets
        </Heading>

        <Box mt="1rem">
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
        </Box>
      </Flex>
    </Box>
  );
};

export default Markets;
