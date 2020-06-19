import React, { useState, useEffect } from 'react';
import { Flex, Box, Heading, useColorMode } from '@chakra-ui/core';

import Market from './Market';
import MBMarketFactoryContract from 'abis/MBMarketFactory.json';
import addresses, { KOVAN_ID } from 'utils/addresses';
import { bgColor1, color1 } from 'utils/theme';
import { useContract } from 'hooks';
import {
  Table,
  TableBody,
  TableHeadTop,
  TableRow,
  TableHead,
} from './markets.style';

const Markets = (): JSX.Element => {
  const { colorMode } = useColorMode();
  const [markets, setMarkets] = useState([]);
  const factoryAddress = addresses[KOVAN_ID].marketFactory;
  const factoryContract = useContract(
    factoryAddress,
    MBMarketFactoryContract.abi,
    true
  );

  useEffect(() => {
    (async () => {
      let isStale = false;
      if (factoryContract && !isStale) {
        try {
          factoryContract
            .getMarkets()
            .then((markets: any) => setMarkets(markets))
            .catch((error: any) => console.error(error));
        } catch (error) {
          console.error(error);
        }
      }
      return (): void => {
        isStale = true;
      };
    })();
  }, [factoryContract]);

  return (
    <>
      <Box bg={bgColor1[colorMode]} m="0" pb="1rem" rounded="md">
        <Box
          borderTopRightRadius="0.25rem"
          borderTopLeftRadius="0.25rem"
          bg="primary.100"
          h="0.5rem"
        />
        <Flex
          flexDirection="column"
          flexWrap="wrap"
          justifyContent="space-between"
          m="0 auto"
          mb="-1px"
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
    </>
  );
};

export default Markets;
