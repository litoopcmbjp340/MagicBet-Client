import { useEffect, useRef } from "react";
import { Token, TokenAmount } from "@uniswap/sdk";
import useSWR, { responseInterface } from "swr";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { useContract } from "./useContract";
import IERC20 from "@uniswap/v2-core/build/IERC20.json";

enum DataType {
  BlockNumber,
  ETHBalance,
  TokenBalance,
}

function getETHBalance(
  library: Web3Provider
): (chainId: number, address: string) => Promise<TokenAmount> {
  return async (chainId: number, address: string): Promise<TokenAmount> => {
    const ETH = new Token(
      chainId,
      "0x0000000000000000000000000000000000000000",
      18
    );
    return library
      .getBalance(address)
      .then(
        (balance: { toString: () => string }) =>
          new TokenAmount(ETH, balance.toString())
      );
  };
}

export function useETHBalance(
  address?: string,
  suspense = false
): responseInterface<TokenAmount, any> {
  const { chainId, library } = useWeb3React();
  const shouldFetch =
    typeof chainId === "number" && typeof address === "string" && !!library;

  const result = useSWR(
    shouldFetch ? [chainId, address, DataType.ETHBalance] : null,
    getETHBalance(library),
    {
      suspense,
    }
  );
  useKeepSWRDataLiveAsBlocksArrive(result.mutate);
  return result;
}

function getTokenBalance(
  contract: Contract,
  token: Token
): (address: string) => Promise<TokenAmount> {
  return async (address: string): Promise<TokenAmount> =>
    contract
      .balanceOf(address)
      .then(
        (balance: { toString: () => string }) =>
          new TokenAmount(token, balance.toString())
      );
}

export function useTokenBalance(
  token?: Token,
  address?: string,
  suspense = false
): responseInterface<TokenAmount, any> {
  const contract = useContract(token?.address, IERC20.abi);
  const shouldFetch = !!contract && typeof address === "string";
  const result = useSWR(
    shouldFetch
      ? [address, token!.chainId, token!.address, DataType.TokenBalance]
      : null,
    getTokenBalance(contract!, token!),
    { suspense }
  );
  useKeepSWRDataLiveAsBlocksArrive(result.mutate);
  return result;
}

function getBlockNumber(library: Web3Provider): () => Promise<number> {
  return async (): Promise<number> => {
    return library.getBlockNumber();
  };
}

export function useBlockNumber(): responseInterface<number, any> {
  const { library } = useWeb3React();
  const shouldFetch = !!library;
  return useSWR(
    shouldFetch ? [DataType.BlockNumber] : null,
    getBlockNumber(library),
    {
      refreshInterval: 10 * 1000,
    }
  );
}

export function useKeepSWRDataLiveAsBlocksArrive(
  mutate: responseInterface<any, any>["mutate"]
): void {
  const mutateRef = useRef(mutate);
  useEffect(() => {
    mutateRef.current = mutate;
  });
  const { data } = useBlockNumber();
  useEffect(() => {
    mutateRef.current();
  }, [data]);
}
