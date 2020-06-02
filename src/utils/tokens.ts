import { useMemo } from "react";
import { ChainId, WETH, Token } from "@uniswap/sdk";

export const DEFAULT_TOKENS = [
  ...Object.values(WETH),

  new Token(
    ChainId.KOVAN,
    "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
    18,
    "DAI",
    "Dai Stablecoin"
  ),
];

export function useTokens() {
  return [
    useMemo(() => {
      return DEFAULT_TOKENS;
    }, []),
  ];
}
