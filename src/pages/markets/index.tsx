import React, { useState } from "react";
import styled from "@emotion/styled";
import { Flex, Box, Heading } from "@chakra-ui/core";

import { useContract } from "utils/hooks";
import Market from "./Market";
import BTMarketFactoryContract from "abis/BTMarketFactory.json";
import addresses, { KOVAN_ID } from "utils/addresses";

const Table = styled.table`
  width: 100%;
`;

const TableBody = styled.tbody``;

const TableHead = styled.th<{ roundedLeft?: boolean; roundedRight?: boolean }>`
  border-bottom: 1px solid #ddd;
  background-color: #252c41;
  color: #f4f5f9;
  border-top-left-radius: ${(props) => (props.roundedLeft ? "0.5rem" : 0)};
  border-top-right-radius: ${(props) => (props.roundedRight ? "0.5rem" : 0)};
`;

const TableHeadTop = styled.thead`
  border-bottom: 1px solid #ddd;
  background-color: #252c41;
  color: #f4f5f9;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #252c41;
  &:hover {
    background-color: #dddfe6;
  }
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
    <Box backgroundColor="white.100" margin="0" paddingBottom="1rem">
      <Flex
        marginBottom="-1px"
        flexDirection="column"
        flexWrap="wrap"
        margin="0 auto"
        width="100%"
        justifyContent="space-between"
        padding="1rem 1.5rem"
      >
        <Heading
          as="h3"
          size="lg"
          fontSize="1.5rem"
          font-weight="500"
          color="black.100"
        >
          Markets
        </Heading>

        <Box mt="1rem">
          <Table>
            <TableHeadTop>
              <TableRow>
                <TableHead roundedLeft>Address</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Winning Outcome</TableHead>
                <TableHead>Winnings</TableHead>
                <TableHead roundedRight>Finish Date</TableHead>
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
      </Flex>
    </Box>
  );
};

export default Markets;
