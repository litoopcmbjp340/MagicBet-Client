import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Flex, Box, Heading, useColorMode } from "@chakra-ui/core";

import Market from "./market";
import BTMarketFactoryContract from "abis/BTMarketFactory.json";
import addresses, { KOVAN_ID } from "utils/addresses";
import { bgColor, color } from "theme";
import { useContract } from "hooks";

const Table = styled.table`
  width: 100%;
`;

const TableBody = styled.tbody``;

const TableHeadTop = styled.thead``;

const TableRow = styled.tr<{ colorMode: string }>`
  background-color: ${(props) =>
    props.colorMode === "light" ? "#f4f5f9" : "#777"};
  border-bottom: 1px solid
    ${(props) => (props.colorMode === "light" ? "#252c41" : "#121212")};
`;

const TableHead = styled.th<{
  roundedLeft?: boolean;
  roundedRight?: boolean;
  colorMode?: string;
}>`
  border-bottom: 1px solid #ddd;
  background-color: ${(props) =>
    props.colorMode === "light" ? "#252c41" : "#121212"};
  color: #f4f5f9;
  border-top-left-radius: ${(props) => (props.roundedLeft ? "0.5rem" : 0)};
  border-top-right-radius: ${(props) => (props.roundedRight ? "0.5rem" : 0)};
`;

const Markets = (): JSX.Element => {
  const { colorMode } = useColorMode();
  const [markets, setMarkets] = useState([]);
  const factoryAddress = addresses[KOVAN_ID].marketFactory;
  const factoryContract = useContract(
    factoryAddress,
    BTMarketFactoryContract.abi,
    true
  );

  useEffect(() => {
    (async () => {
      let stale = false;
      if (factoryContract && !stale) {
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
        stale = true;
      };
    })();
  }, [factoryContract]);

  return (
    <Box bg={bgColor[colorMode]} margin="0" paddingBottom="1rem">
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
          color={color[colorMode]}
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
