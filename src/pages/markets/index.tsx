import React, { useState } from "react";
import styled from "@emotion/styled";
import { Flex, Box } from "@chakra-ui/core";

import { useContract } from "utils/hooks";
import Market from "./Market";
import BTMarketFactoryContract from "abis/BTMarketFactory.json";
import addresses, { KOVAN_ID } from "utils/addresses";

const Table = styled.table`
  width: 100%;
`;

const TableBody = styled.tbody``;

const TableHead = styled.th`
  border-bottom: 1px solid #ddd;
  background-color: #dddddd;
  color: white.100;
`;

const TableHeadTop = styled.thead`
  border-bottom: 1px solid #ddd;
  background-color: #dddddd;
  color: white.100;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const Markets = () => {
  const [markets, setMarkets] = useState([]);
  const factoryAddress = addresses[KOVAN_ID].marketFactory;
  const factoryContract = useContract(
    factoryAddress,
    BTMarketFactoryContract.abi,
    true
  );

  const fetchMarkets = async () => {
    if (factoryContract) {
      try {
        const markets = await factoryContract.getMarkets();
        setMarkets(markets);
      } catch (error) {
        console.error(error);
      }
    }
  };

  fetchMarkets();

  const ActiveMarket = ({ children }: any) => (
    <Box
      backgroundColor="white.100"
      boxShadow="rgba(0, 0, 0, 0.04) 0 0 1.5rem 0"
      color="#1e2026"
      flex="1"
      fontSize="0.8rem"
      marginRight="1rem"
      padding="1rem"
      position="relative"
      textDecoration="none"
    >
      {children}
    </Box>
  );

  return (
    <>
      <Box backgroundColor="gray.100" margin="0" padding="1rem">
        <Flex
          flexDirection="column"
          flexWrap="wrap"
          margin="0 auto"
          width="100%"
        >
          <Flex flex="1" justifyContent="spaceBetween" margin="0">
            <ActiveMarket>ActiveMarket 1</ActiveMarket>
            <ActiveMarket>ActiveMarket 2</ActiveMarket>
          </Flex>
          <Flex flex="1" justifyContent="spaceBetween" margin="1.5rem 0 0">
            <ActiveMarket>ActiveMarket 3</ActiveMarket>
            <ActiveMarket>ActiveMarket 4</ActiveMarket>
          </Flex>
        </Flex>
      </Box>
      <Box backgroundColor="white.100" margin="0" padding="1.5rem 1rem">
        <Box>
          <Table>
            <TableHeadTop>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Winning Outcome</TableHead>
                <TableHead>Winnings</TableHead>
                <TableHead>Finish Date</TableHead>
              </TableRow>
            </TableHeadTop>
            <TableBody>
              {markets.length > 0 &&
                markets.map((market: string) => {
                  return (
                    <TableRow key={market}>
                      <Market market={market} />
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </>
  );
};

export default Markets;
