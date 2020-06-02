import { useMemo } from "react";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import BTMarketFactoryContract from "abis/BTMarketFactory.json";
import addresses, { KOVAN_ID } from "utils/addresses";
import IERC20 from "abis/IERC20.json";

const factoryAddress = addresses[KOVAN_ID].marketFactory;
const daiAddress = addresses[KOVAN_ID].tokens.DAI;

export function useFactoryContract(): Contract | undefined {
  const { library, account } = useWeb3React<Web3Provider>();

  return useMemo(
    () =>
      !!library
        ? new Contract(
            factoryAddress,
            BTMarketFactoryContract.abi,
            library.getSigner(account!).connectUnchecked()
          )
        : undefined,
    [library, account]
  );
}

export function useDaiContract(): Contract | undefined {
  const context = useWeb3React<Web3Provider>();
  const { library, account } = context;
  return useMemo(
    () =>
      !!library
        ? new Contract(
            daiAddress,
            IERC20.abi,
            library.getSigner(account!).connectUnchecked()
          )
        : undefined,
    [library, account]
  );
}

export async function getMostRecentAddress(factoryContract: any) {
  let deployedMarkets = await factoryContract.getMarkets();
  if (deployedMarkets.length !== 0) {
    return deployedMarkets[deployedMarkets.length - 1];
  }
}
