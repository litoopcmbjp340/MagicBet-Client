import { useMemo } from 'react';
import { ChainId, WETH, Token } from '@uniswap/sdk';

export const DEFAULT_TOKENS = [
  ...Object.values(WETH),

  new Token(
    ChainId.KOVAN,
    '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
    18,
    'DAI',
    'Dai Stablecoin'
  ),
];

export function useTokens() {
  return [
    useMemo(() => {
      return DEFAULT_TOKENS;
    }, []),
  ];
}
