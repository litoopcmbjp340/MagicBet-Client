import React, { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import styled from '@emotion/styled';
import { Link } from '@chakra-ui/core';

import { shortenAddress } from 'utils';
import BTMarketContract from 'abis/BTMarket.json';
import { getFormattedNumber } from 'utils';

const TableHead = styled.th``;

function Market({ market }: { market: string }) {
  const [question, setQuestion] = useState<number>(0);
  const [questionId, setQuestionId] = useState<number>(0);
  const [maxInterests, setMaxInterest] = useState<number>(0);
  const [marketResolutionTime, setMarketResolutionTime] = useState<number>(0);
  const [winningOutcome, setWinningOutcome] = useState<number>(0);

  useEffect(() => {
    let isStale = false;
    (async () => {
      let marketContract: any;

      const provider = new Web3Provider(window.web3.currentProvider);
      const wallet = provider.getSigner();
      marketContract = new Contract(market, BTMarketContract.abi, wallet);

      try {
        if (!isStale) {
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
          if (_winningOutcomeId.toString() !== '69') {
            _winningOutcome = await marketContract.outcomeNames(
              _winningOutcomeId
            );
          }

          setQuestion(_question);
          setQuestionId(_questionId);
          setMaxInterest(_maxInterests);
          setMarketResolutionTime(_marketResolutionTime);
          setWinningOutcome(_winningOutcome);
        }
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      isStale = true;
    };
  }, [market]);

  return (
    <>
      {
        <>
          <TableHead>
            <Link href={`https://kovan.etherscan.io/address/${market}`}>
              {shortenAddress(market)}
            </Link>
          </TableHead>
          <TableHead>
            <Link href={`https://realitio.github.io/#!/question/${questionId}`}>
              {question}
            </Link>
          </TableHead>
          <TableHead>
            {winningOutcome ? winningOutcome.toString() : 'Not yet resolved'}
          </TableHead>
          <TableHead>{`${getFormattedNumber(
            maxInterests / 1e18,
            18
          )} DAI`}</TableHead>
          <TableHead>
            {new Date(marketResolutionTime * 1000).toUTCString()}
          </TableHead>
        </>
      }
    </>
  );
}

export default Market;
