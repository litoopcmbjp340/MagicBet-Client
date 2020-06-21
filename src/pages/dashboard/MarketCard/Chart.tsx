import React, { useState, useEffect } from 'react';
import { formatEther } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';
import { Box, Flex } from '@chakra-ui/core';
import moment from 'moment';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function Chart({
  marketContract,
}: {
  marketContract: Contract;
}) {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    (async () => {
      let isStale = false;
      if (!isStale) {
        let openingTime: any;
        let closingTime: any;
        let timeFrame: any;
        let numberOfOutcomes: any;
        let interval: any;

        openingTime = await marketContract.marketOpeningTime();
        openingTime = openingTime.toNumber();
        closingTime = await marketContract.marketLockingTime();
        closingTime = closingTime.toNumber();

        if (!!openingTime && !!closingTime) {
          timeFrame = (closingTime - openingTime) / 14400;
          interval = Math.ceil(timeFrame);
        }
        numberOfOutcomes = await marketContract.numberOfOutcomes();

        // console.log('interval:', interval);

        let newData0 = {
          time: interval * 0,
        };

        let newData1 = {
          time: interval * 1,
        };

        let newData2 = {
          time: interval * 2,
        };

        let newData3 = {
          time: interval * 3,
        };

        let newData4 = {
          time: interval * 4,
        };

        let outcomeName: string;

        for (let i = 0; i < numberOfOutcomes; i++) {
          outcomeName = await marketContract.outcomeNames(i);
          let pair = { [outcomeName]: 0 };
          newData0 = { ...newData0, ...pair };
          newData1 = { ...newData1, ...pair };
          newData2 = { ...newData2, ...pair };
          newData3 = { ...newData3, ...pair };
          newData4 = { ...newData4, ...pair };

          async function getBetsAndTimestamps() {
            let betsForOutcome: string[] = [];
            const amountOfBetsForOutcome = await marketContract.getBetAmountsArray(
              i
            );
            amountOfBetsForOutcome.forEach((bet: any) => {
              const formattedBets = formatEther(bet.toString());
              betsForOutcome.push(formattedBets);
            });
            let timestampsForOutcome: string[] = [];
            const betTimestampsOnOutcome = await marketContract.getTimestampsArray(
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
            for (let i = 0; i <= 4; i++) {
              let amount = betsForOutcome[i];
              let timestamp = timestampsForOutcome[i];
              let newBetAndTimestamp = {
                id: i,
                amount: parseInt(amount),
                timestamp: parseInt(timestamp),
              };

              outcomeBetsAndTimestamp.push(newBetAndTimestamp);
            }
            return outcomeBetsAndTimestamp;
          }

          const outcomeBetsAndTimestamp = await getBetsAndTimestamps();
          // console.log('outcomeBetsAndTimestamp:', outcomeBetsAndTimestamp);

          //!CHART
          outcomeBetsAndTimestamp.forEach((item: any) => {
            let point = item.timestamp;

            let difference = point - openingTime;
            // console.log('difference:', difference);

            // put into newData0 if the point is between openingTime (1592766557) and + 18hr
            if (openingTime < point && point < openingTime + 64800)
              //@ts-ignore
              newData0[outcomeName] = newData0[outcomeName] + item.amount;
            else if (
              openingTime + 64800 < point &&
              point < openingTime + 129600
            )
              //@ts-ignore
              newData1[outcomeName] = newData1[outcomeName] + item.amount;
            else if (
              openingTime + 129600 < point &&
              point < openingTime + 194400
            )
              //@ts-ignore
              newData2[outcomeName] = newData2[outcomeName] + item.amount;
            else if (
              openingTime + 194400 < point &&
              point < openingTime + 259200
            )
              //@ts-ignore
              newData3[outcomeName] = newData3[outcomeName] + item.amount;
            else if (openingTime + 259200 < point)
              //@ts-ignore
              newData4[outcomeName] = newData4[outcomeName] + item.amount;
          });

          setData([newData0, newData1, newData2, newData3, newData4]);
        }
      }

      return () => {
        isStale = true;
      };
    })();
  }, []);

  return <Graph data={data} />;
}

const Graph = ({ data }: any) => {
  return !data ? null : (
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
          <XAxis dataKey="time" />
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
