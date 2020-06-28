import React, { useState, useEffect } from 'react';
import { formatEther } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';
import { Button, ButtonGroup, Flex } from '@chakra-ui/core';

import Graph from './Chart';

interface IBetsAndTimestamps {
  id: number;
  amount: number;
  timestamp: number;
}

interface IData {
  time: number;
}

export default function Chart({
  marketContract,
}: {
  marketContract: Contract;
}) {
  const [data, setData] = useState<any>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState<string>('');

  useEffect(() => {
    let isStale = false;
    if (!isStale)
      marketContract.on('ParticipantEntered', (address: any) =>
        setNewAddress(address)
      );

    return () => {
      isStale = true;
    };
  }, []);

  useEffect(() => {
    (async () => {
      let isStale = false;

      let newData0 = {
        time: 0,
      };

      let newData1 = {
        time: 0,
      };

      let newData2 = {
        time: 0,
      };

      let newData3 = {
        time: 0,
      };

      let newData4 = {
        time: 0,
      };

      if (!isStale) {
        let outcomes = await marketContract.getOutcomeNames();

        setOptions(outcomes);

        let openingTime = await marketContract.marketOpeningTime();
        openingTime = openingTime.toNumber();
        let closingTime = await marketContract.marketLockingTime();
        closingTime = closingTime.toNumber();

        let timeFrame: any;
        let interval: any;
        if (!!openingTime && !!closingTime) {
          timeFrame = (closingTime - openingTime) / 14400;
          interval = Math.ceil(timeFrame);
        }

        newData0.time = interval * 0;
        newData1.time = interval * 1;
        newData2.time = interval * 2;
        newData3.time = interval * 3;
        newData4.time = interval * 4;

        for (let i = 0; i < outcomes.length; i++) {
          let outcomeName: string = outcomes[i];
          let pair = { [outcomeName]: 0 };
          newData0 = { ...newData0, ...pair };
          newData1 = { ...newData1, ...pair };
          newData2 = { ...newData2, ...pair };
          newData3 = { ...newData3, ...pair };
          newData4 = { ...newData4, ...pair };

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

          //!COMBINE
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
  }, [newAddress]);

  return data === undefined ? null : options === undefined ? null : (
    <Flex align="center" direction="column">
      <Graph data={data} options={options} />
      <ButtonGroup isAttached={true} size="xs">
        <Button
          bg="primary.100"
          color="light.100"
          onClick={() => console.log('render last 24h')}
        >
          24H
        </Button>
        <Button
          bg="primary.100"
          color="light.100"
          onClick={() => console.log('render last 7 days')}
        >
          7D
        </Button>
        <Button
          bg="primary.100"
          color="light.100"
          onClick={() => console.log('render last 30 days')}
        >
          30D
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
