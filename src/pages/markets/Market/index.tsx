import React, { useEffect, useState } from "react";
import { providers, Contract } from "ethers";
import styled from "@emotion/styled";
import { Link } from "@chakra-ui/core";

import { shortenAddress } from "utils";
import BTMarketContract from "abis/BTMarket.json";

const TableHead = styled.th``;

const getFormattedNumber = (floatBalance: number, decimals: number) => {
  if (floatBalance === 0) {
    return 0;
  } else if (floatBalance < 1) {
    const decimalDigits = floatBalance.toFixed(decimals).slice(2);
    const leadingZeros = decimalDigits.search(/[1-9]/);
    const firstTwoDigits = decimalDigits.slice(leadingZeros, leadingZeros + 2);

    return `0.${"0".repeat(leadingZeros)}${firstTwoDigits}`;
  } else if (floatBalance < 10) return Math.round(floatBalance * 10) / 10;

  return Math.round(floatBalance);
};

function Market({ market }: { market: string }) {
  const [question, setQuestion] = useState<number>(0);
  const [questionId, setQuestionId] = useState<number>(0);
  const [maxInterests, setMaxInterest] = useState<number>(0);
  const [marketResolutionTime, setMarketResolutionTime] = useState<number>(0);
  const [winningOutcome, setWinningOutcome] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const provider = new providers.Web3Provider(window.web3.currentProvider);
      const wallet = provider.getSigner();
      const marketContract: any = new Contract(
        market,
        BTMarketContract.abi,
        wallet
      );

      const [_question, _questionId, _maxInterests, _marketResolutionTime, _winningOutcomeId] = await Promise.all([
        marketContract.eventName(),
        marketContract.questionId(),
        marketContract.getMaxTotalInterest(),
        marketContract.marketResolutionTime(),
        marketContract.winningOutcome(),
      ]);
      let _winningOutcome;

      if (_winningOutcomeId.toString() !== "69") {
        _winningOutcome = await marketContract.outcomeNames(_winningOutcomeId);
      }

      setQuestion(_question);
      setQuestionId(_questionId);
      setMaxInterest(_maxInterests);
      setMarketResolutionTime(_marketResolutionTime);
      setWinningOutcome(_winningOutcome);
    })();
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
            {winningOutcome ? winningOutcome.toString() : "Not yet resolved"}
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
