import React, { useState, useEffect } from 'react';
import { formatEther } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';
import { Button, ButtonGroup, Flex } from '@chakra-ui/core';
import moment from 'moment';

import Graph from './Chart';

interface IBetsAndTimestamps {
  id: number;
  amount: number;
  timestamp: number;
}

interface IData {
  time: number;
}

interface IBet {
  outcome: string;
  amount: number;
  timestamp: number;
}

export default function Chart({
  marketContract,
}: {
  marketContract: Contract;
}) {
  const [data, setData] = useState<any>([]);
  const [outcomes, setOutcomes] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState<string>('');
  enum TimeFrame {
    Day,
    Week,
  }
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(TimeFrame.Day);
  const [bets, setBets] = useState<IBet[]>([]);

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

  async function getSortedValues(bets: IBet[], outcomes: any) {
    console.log('bets:', bets);
    let openingTime;
    marketContract
      .marketOpeningTime()
      .then((resultInHex: any) => (openingTime = resultInHex.toNumber()));
    const current = Math.floor(Date.now() / 1000);

    // let data: IRechartData[] = []

    if (timeFrame === TimeFrame.Day) {
      const YESTERDAY = current - 24 * 60 * 60 * 1000;
      const FOUR_HOUR_INTERVAL = 3600 * 4;
      const TwentyHoursAgo = YESTERDAY + FOUR_HOUR_INTERVAL;
      const SixteenHoursAgo = TwentyHoursAgo + FOUR_HOUR_INTERVAL;
      const TwelveHoursAgo = SixteenHoursAgo + FOUR_HOUR_INTERVAL;
      const EightHoursAgo = TwelveHoursAgo + FOUR_HOUR_INTERVAL;
      const FourHoursAgo = EightHoursAgo + FOUR_HOUR_INTERVAL;

      let data: any[] = [
        { name: '24' },
        { name: '20' },
        { name: '16' },
        { name: '12' },
        { name: '8' },
        { name: '4' },
      ];

      console.log('data without options:', data);

      for (let i = 0; i < outcomes.length; i++) {
        data.forEach((dataPoint: any) => {
          let outcome: any = outcomes[i];
          console.log('outcome:', outcome);
          dataPoint[outcome] = 0;
        });
      }

      console.log('data with options:', data);

      bets.forEach((bet: any) => {
        if (YESTERDAY < bet.timestamp && bet.timestamp <= TwentyHoursAgo) {
          if (bet.outcome === data.outcome) data[0].outcome + bet.amount;
        } else if (
          TwentyHoursAgo < bet.timestamp &&
          bet.timestamp <= SixteenHoursAgo
        ) {
          data[1].outcome + bet.amount;
        } else if (
          SixteenHoursAgo < bet.timestamp &&
          bet.timestamp <= TwelveHoursAgo
        ) {
          data[2].outcome + bet.amount;
        } else if (
          TwelveHoursAgo < bet.timestamp &&
          bet.timestamp <= EightHoursAgo
        ) {
          data[3].outcome + bet.amount;
        } else if (
          EightHoursAgo < bet.timestamp &&
          bet.timestamp <= FourHoursAgo
        ) {
          data[4].outcome + bet.amount;
        } else if (FourHoursAgo < bet.timestamp) {
          data[5].outcome + bet.amount;
        }
      });

      console.log('data:', data);
    } else if (timeFrame === TimeFrame.Week) {
      const LAST_WEEK = current - 7 * 24 * 60 * 60 * 1000;
      const ONE_DAY_INTERVAL = 3600 * 24;
      const sixDaysAgo = LAST_WEEK + ONE_DAY_INTERVAL;
      const fiveDaysAgo = sixDaysAgo + ONE_DAY_INTERVAL;
      const fourDaysAgo = fiveDaysAgo + ONE_DAY_INTERVAL;
      const threeDaysAgo = fourDaysAgo + ONE_DAY_INTERVAL;
      const twoDaysAgo = threeDaysAgo + ONE_DAY_INTERVAL;
      const oneDayAgo = twoDaysAgo + ONE_DAY_INTERVAL;

      let data: any[] = [
        { name: `${moment(LAST_WEEK).format('MMM Do')}` },
        { name: `${moment(sixDaysAgo).format('MMM Do')}` },
        { name: `${moment(fiveDaysAgo).format('MMM Do')}` },
        { name: `${moment(fourDaysAgo).format('MMM Do')}` },
        { name: `${moment(threeDaysAgo).format('MMM Do')}` },
        { name: `${moment(twoDaysAgo).format('MMM Do')}` },
        { name: `${moment(oneDayAgo).format('MMM Do')}` },
      ];

      console.log('data without options:', data);

      for (let i = 0; i < outcomes.length; i++) {
        data.forEach((dataPoint: any) => {
          let outcome: any = outcomes[i];
          console.log('outcome:', outcome);
          dataPoint[outcome] = 0;
        });
      }

      console.log('data with options:', data);

      bets.forEach((bet: any) => {
        if (YESTERDAY < bet.timestamp && bet.timestamp <= TwentyHoursAgo) {
          if (bet.outcome === data.outcome) data[0].outcome + bet.amount;
        } else if (
          TwentyHoursAgo < bet.timestamp &&
          bet.timestamp <= SixteenHoursAgo
        ) {
          data[1].outcome + bet.amount;
        } else if (
          SixteenHoursAgo < bet.timestamp &&
          bet.timestamp <= TwelveHoursAgo
        ) {
          data[2].outcome + bet.amount;
        } else if (
          TwelveHoursAgo < bet.timestamp &&
          bet.timestamp <= EightHoursAgo
        ) {
          data[3].outcome + bet.amount;
        } else if (
          EightHoursAgo < bet.timestamp &&
          bet.timestamp <= FourHoursAgo
        ) {
          data[4].outcome + bet.amount;
        } else if (FourHoursAgo < bet.timestamp) {
          data[5].outcome + bet.amount;
        }
      });

      console.log('data:', data);
    } else console.error('no chart date selected');

    // return data;
  }

  useEffect(() => {
    (async () => {
      let isStale = false;

      if (!isStale) {
        const outcomes = await marketContract.getOutcomeNames();
        setOutcomes(outcomes);

        let bets: IBet[] = [];
        outcomes.forEach(async (outcome: any, i: any) => {
          const amountOfBetsForOutcome = await marketContract.getBetAmountsArray(
            i
          );

          let outcomeBets: IBet[] = [];

          amountOfBetsForOutcome.forEach((bet: any) => {
            let betObject: IBet = {
              outcome,
              amount: 0,
              timestamp: 0,
            };

            const asString = formatEther(bet.toString());
            betObject.amount = parseFloat(asString);
            outcomeBets.push(betObject);
          });

          let timestampsForOutcome: string[] = [];

          const betTimestampsOnOutcome = await marketContract.getTimestampsArray(
            i
          );

          for (let i = 0; i < betTimestampsOnOutcome.length; i++) {
            let timestamp = betTimestampsOnOutcome[i];
            outcomeBets[i].timestamp = timestamp.toNumber();
          }

          betTimestampsOnOutcome.forEach((timestamp: any) => {
            timestampsForOutcome.push(timestamp.toString());
          });

          bets.push(...outcomeBets);
        });

        // //!SORTING
        getSortedValues(bets, outcomes);
        // outcomeBetsAndTimestamp.forEach((item: any) => {
        //   let point = item.timestamp;

        //   // put into newData0 if the point is between openingTime (1592766557) and + 18hr
        //   if (openingTime < point && point < openingTime + 64800)
        //     //@ts-ignore
        //     newData0[outcomeName] = newData0[outcomeName] + item.amount;
        //   else if (
        //     openingTime + 64800 < point &&
        //     point < openingTime + 129600
        //   )
        //     //@ts-ignore
        //     newData1[outcomeName] = newData1[outcomeName] + item.amount;
        //   else if (
        //     openingTime + 129600 < point &&
        //     point < openingTime + 194400
        //   )
        //     //@ts-ignore
        //     newData2[outcomeName] = newData2[outcomeName] + item.amount;
        //   else if (
        //     openingTime + 194400 < point &&
        //     point < openingTime + 259200
        //   )
        //     //@ts-ignore
        //     newData3[outcomeName] = newData3[outcomeName] + item.amount;
        //   else if (openingTime + 259200 < point)
        //     //@ts-ignore
        //     newData4[outcomeName] = newData4[outcomeName] + item.amount;
        // });

        //setData([newData0, newData1, newData2, newData3, newData4]);
      }

      return () => {
        isStale = true;
      };
    })();
  }, [newAddress]);

  return data === undefined ? null : outcomes === undefined ? null : (
    <Flex align="center" direction="column">
      {/* <Graph data={data} options={options} /> */}
      {/* {console.log('data:', data)}
      {console.log('options:', options)} */}
      <ButtonGroup isAttached={true} size="xs">
        <Button
          bg="primary.100"
          color="light.100"
          onClick={() => setTimeFrame(TimeFrame.Day)}
        >
          24H
        </Button>
        <Button
          bg="primary.100"
          color="light.100"
          onClick={() => setTimeFrame(TimeFrame.Week)}
        >
          7D
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
