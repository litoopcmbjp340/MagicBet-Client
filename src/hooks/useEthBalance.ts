import { Token, TokenAmount } from "@uniswap/sdk";
import useSWR, { responseInterface } from "swr";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { DataType } from "utils/constants";
import useKeepSWRDataLiveAsBlocksArrive from "./useBlockNumber";
import { ZERO_ADDRESS } from "utils/constants";

function getEthBalance(
  library: Web3Provider
): (chainId: number, address: string) => Promise<TokenAmount> {
  return async (chainId: number, address: string): Promise<TokenAmount> => {
    const ETH = new Token(chainId, ZERO_ADDRESS, 18);
    return library
      .getBalance(address)
      .then(
        (balance: { toString: () => string }) =>
          new TokenAmount(ETH, balance.toString())
      );
  };
}

export default function useETHBalance(
  address?: string,
  suspense = false
): responseInterface<TokenAmount, any> {
  const { chainId, library } = useWeb3React();
  const shouldFetch =
    typeof chainId === "number" && typeof address === "string" && !!library;

  const result = useSWR(
    shouldFetch ? [chainId, address, DataType.ETHBalance] : null,
    getEthBalance(library),
    {
      suspense,
    }
  );
  useKeepSWRDataLiveAsBlocksArrive(result.mutate);
  return result;
}
