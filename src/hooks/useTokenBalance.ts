import { Token, TokenAmount } from "@uniswap/sdk";
import useSWR, { responseInterface } from "swr";
import { Contract } from "@ethersproject/contracts";
import useContract from "./useContract";
import IERC20 from "@uniswap/v2-core/build/IERC20.json";
import { DataType } from "utils/constants";
import useKeepSWRDataLiveAsBlocksArrive from "./useBlockNumber";

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

export default function useTokenBalance(
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

function getTokenAllowance(
  contract: Contract,
  token: Token
): (owner: string, spender: string) => Promise<TokenAmount> {
  return async (owner: string, spender: string): Promise<TokenAmount> =>
    contract
      .allowance(owner, spender)
      .then(
        (balance: { toString: () => string }) =>
          new TokenAmount(token, balance.toString())
      );
}

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): responseInterface<TokenAmount, any> {
  const contract = useContract(token?.address, IERC20.abi);
  const shouldFetch =
    !!contract && typeof owner === "string" && typeof spender === "string";
  const result = useSWR(
    shouldFetch
      ? [
          owner,
          spender,
          token!.chainId,
          token!.address,
          DataType.TokenAllowance,
        ]
      : null,
    getTokenAllowance(contract!, token!)
  );
  useKeepSWRDataLiveAsBlocksArrive(result.mutate);
  return result;
}
