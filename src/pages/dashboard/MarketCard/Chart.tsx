import React, { useState, useEffect } from "react";
import { utils } from "ethers";
import { Box, Flex } from "@chakra-ui/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useColorMode } from "@chakra-ui/core";

interface IChart {
  marketContract: any;
  rerender: boolean;
}

export default function Chart({ marketContract, rerender }: IChart) {
  const [data, setData] = useState<any>([]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    (async () => {
      let isExpired = false;
      let numberOfOutcomes = await marketContract.numberOfOutcomes();
      let outcomeName: any;
      let newData1 = {
        name: "0 min",
      };

      let newData2 = {
        name: "1 min",
      };

      let newData3 = {
        name: "2 min",
      };

      let newData4 = {
        name: "3 min",
      };

      let newData5 = {
        name: "4 min+",
      };

      for (let i = 0; i < numberOfOutcomes; i++) {
        outcomeName = await marketContract.outcomeNames(i);
        let pair = { [outcomeName]: 0 };
        newData1 = { ...newData1, ...pair };
        newData2 = { ...newData2, ...pair };
        newData3 = { ...newData3, ...pair };
        newData4 = { ...newData4, ...pair };
        newData5 = { ...newData5, ...pair };

        async function getBetsAndTimestamps() {
          let betsForOutcome: string[] = [];
          let amountOfBetsForOutcome = await marketContract.getBetAmountsArray(
            i
          );
          amountOfBetsForOutcome.forEach((bet: any) => {
            let formattedBets = utils.formatEther(bet.toString());
            betsForOutcome.push(formattedBets);
          });
          let timestampsForOutcome: string[] = [];
          let betTimestampsOnOutcome = await marketContract.getTimestampsArray(
            i
          );
          betTimestampsOnOutcome.forEach((timestamp: any) => {
            let formattedTimestamp = timestamp.toString();
            timestampsForOutcome.push(formattedTimestamp);
          });

          //!Combine
          interface IBetsAndTimestamps {
            id: number;
            amount: number;
            timestamp: number;
          }
          let outcomeBetsAndTimestamp: IBetsAndTimestamps[] = [];
          for (let i = 0; i < 5; i++) {
            let id = i;
            let amount = betsForOutcome[i];
            let timestamp = timestampsForOutcome[i];
            let newBetAndTimestamp = {
              id: id,
              amount: parseInt(amount),
              timestamp: parseInt(timestamp),
            };

            outcomeBetsAndTimestamp.push(newBetAndTimestamp);
          }
          return outcomeBetsAndTimestamp;
        }

        let outcomeBetsAndTimestamp = await getBetsAndTimestamps();

        //!CHART
        const start = await marketContract.marketOpeningTimeActual();
        const startPeriod = start.toNumber();

        // eslint-disable-next-line no-loop-func
        outcomeBetsAndTimestamp.forEach((item: any) => {
          if (
            startPeriod < item.timestamp &&
            item.timestamp < startPeriod + 60
          ) {
            //@ts-ignore
            newData1[outcomeName] = newData1[outcomeName] + item.amount;
          } else if (
            startPeriod + 60 < item.timestamp &&
            item.timestamp < startPeriod + 120
          ) {
            //@ts-ignore
            newData2[outcomeName] = newData2[outcomeName] + item.amount;
          } else if (
            startPeriod + 120 < item.timestamp &&
            item.timestamp < startPeriod + 180
          ) {
            //@ts-ignore
            newData3[outcomeName] = newData3[outcomeName] + item.amount;
          } else if (
            startPeriod + 180 < item.timestamp &&
            item.timestamp < startPeriod + 240
          ) {
            //@ts-ignore
            newData4[outcomeName] = newData4[outcomeName] + item.amount;
          } else if (startPeriod + 240 < item.timestamp) {
            //@ts-ignore
            newData5[outcomeName] = newData5[outcomeName] + item.amount;
          }
        });

        setData([newData1, newData2, newData3, newData4, newData5]);
      }

      return () => {
        isExpired = true;
      };
    })();
  }, [marketContract, rerender]);

  return <Graph data={data} />;
}

//TODO: FILL OUT WITH PROPER DARK COLOR
// const strokeColor1 = { light: "#0015BC", dark: "#808ade" };
// const strokeColor2 = {light: "#FF0000", dark: "#ff6666"}

const Graph = ({ data }: any) => {
  return (
    <Box mt="3rem">
      <Flex justifyContent="center">
        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Biden" stroke="#0015BC" />
          <Line type="monotone" dataKey="Trump" stroke="#FF0000" />
        </LineChart>
      </Flex>
    </Box>
  );
};
