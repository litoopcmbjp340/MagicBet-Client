import React, { useState, useEffect } from "react";
import { utils } from "ethers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function NewChart({ marketContract }: any) {
  const [outcomes, setOutcomes] = useState<string[]>([]);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    (async () => {
      let numberOfOutcomes = await marketContract.numberOfOutcomes();
      let newOutcomes: string[] = [];
      for (let i = 0; i < numberOfOutcomes; i++) {
        let outcomeName = await marketContract.outcomeNames(i);
        outcomes.push(outcomeName);
      }
      setOutcomes(newOutcomes);

      for (let i = 0; i < numberOfOutcomes; i++) {
        //!BETS
        let betsForOutcome: string[] = [];
        let amountOfBetsForOutcome = await marketContract.getBetAmountsArray(i);
        amountOfBetsForOutcome.forEach((bet: any) => {
          let formattedBets = utils.formatEther(bet.toString());
          betsForOutcome.push(formattedBets);
        });

        //!TIMESTAMPS
        let timestampsForOutcome: string[] = [];
        let betTimestampsOnOutcome = await marketContract.getTimestampsArray(i);
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
        for (let i = 0; i < timestampsForOutcome.length; i++) {
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
        //!CHART
        const start = await marketContract.marketOpeningTimeActual();
        const startPeriod = start.toNumber();

        let totalOutcomeBettingPeriod1 = 0;
        let totalOutcomeBettingPeriod2 = 0;
        let totalOutcomeBettingPeriod3 = 0;
        let totalOutcomeBettingPeriod4 = 0;
        let totalOutcomeBettingPeriod5 = 0;
        outcomeBetsAndTimestamp.forEach((item: any) => {
          if (
            startPeriod < item.timestamp &&
            item.timestamp < startPeriod + 60
          ) {
            totalOutcomeBettingPeriod1 =
              totalOutcomeBettingPeriod1 + item.amount;
          } else if (
            startPeriod + 60 < item.timestamp &&
            item.timestamp < startPeriod + 120
          ) {
            totalOutcomeBettingPeriod2 =
              totalOutcomeBettingPeriod2 + item.amount;
          } else if (
            startPeriod + 120 < item.timestamp &&
            item.timestamp < startPeriod + 180
          ) {
            totalOutcomeBettingPeriod3 =
              totalOutcomeBettingPeriod3 + item.amount;
          } else if (
            startPeriod + 180 < item.timestamp &&
            item.timestamp < startPeriod + 240
          ) {
            totalOutcomeBettingPeriod4 =
              totalOutcomeBettingPeriod4 + item.amount;
          } else if (
            startPeriod + 240 < item.timestamp &&
            item.timestamp < startPeriod + 300
          ) {
            totalOutcomeBettingPeriod5 =
              totalOutcomeBettingPeriod5 + item.amount;
          } else {
            console.log("Transaction Timestamp Extends Charts X-Axis...");
          }

          //   let outcomeName = numberOfOutcomes[i];

          let newData1 = {
            name: "0 min",
            outcomeName: totalOutcomeBettingPeriod1,
            biden: 0,
          };

          let newData2 = {
            name: "1 min",
            trump: totalOutcomeBettingPeriod2,
            biden: 0,
          };

          let newData3 = {
            name: "2 min",
            trump: totalOutcomeBettingPeriod3,
            biden: 0,
          };

          let newData4 = {
            name: "3 min",
            trump: totalOutcomeBettingPeriod4,
            biden: 0,
          };

          let newData5 = {
            name: "4 min",
            trump: totalOutcomeBettingPeriod5,
            biden: 0,
          };

          setData([newData1, newData2, newData3, newData4, newData5]);
        });
      }
    })();
    //eslint-disable-next-line
  }, [marketContract]);

  return <Chart data={data} />;
}

const Chart = ({ data }: any) => {
  return (
    <LineChart
      width={500}
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
      <Line type="monotone" dataKey="biden" stroke="#0015BC" />
      <Line type="monotone" dataKey="trump" stroke="#FF0000" />
    </LineChart>
  );
};
