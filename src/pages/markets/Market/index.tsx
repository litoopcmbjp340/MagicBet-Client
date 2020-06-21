import React, { useEffect, useState } from 'react';
import { Link } from '@chakra-ui/core';

import { shortenAddress, getFormattedNumber } from 'utils';
import MBMarketContract from 'abis/MBMarket.json';
import { useContract } from 'hooks';

function Market({ market }: { market: string }) {
  const [question, setQuestion] = useState<number>(0);
  const [questionId, setQuestionId] = useState<number>(0);
  const [maxInterests, setMaxInterest] = useState<number>(0);
  const [marketResolutionTime, setMarketResolutionTime] = useState<number>(0);
  const [winningOutcome, setWinningOutcome] = useState<number>(0);
  const marketContract = useContract(market, MBMarketContract.abi);

  useEffect(() => {
    let isStale = false;
    (async () => {
      try {
        if (!isStale && marketContract) {
          const [
            _question,
            _questionId,
            _maxInterests,
            _marketResolutionTime,
            _winningOutcomeId,
          ] = await Promise.all([
            marketContract.eventName(),
            marketContract.questionId(),
            marketContract.getMaxTotalInterest(),
            marketContract.marketResolutionTime(),
            marketContract.winningOutcome(),
          ]);

          let _winningOutcome;
          if (
            _winningOutcomeId.toString() !==
            '115792089237316195423570985008687907853269984665640564039457584007913129639935'
          ) {
            _winningOutcome = await marketContract.outcomeNames(
              _winningOutcomeId
            );
          }

          setQuestion(_question);
          setQuestionId(_questionId);
          setMaxInterest(_maxInterests);
          setMarketResolutionTime(_marketResolutionTime);
          setWinningOutcome(_winningOutcomeId);
        }
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      isStale = true;
    };
  }, [market, marketContract]);

  return (
    <>
      {
        <>
          <th>
            <Link href={`https://kovan.etherscan.io/address/${market}`}>
              {shortenAddress(market)}
            </Link>
          </th>
          <th>
            <Link href={`https://realitio.github.io/#!/question/${questionId}`}>
              {question}
            </Link>
          </th>
          <th>
            {/* {winningOutcome ? winningOutcome.toString() : 'Not yet resolved'} */}
            {'Not yet resolved'}
          </th>
          <th>{`${getFormattedNumber(maxInterests / 1e18, 18)} DAI`}</th>
          <th>{new Date(marketResolutionTime * 1000).toUTCString()}</th>
        </>
      }
    </>
  );
}

export default Market;
