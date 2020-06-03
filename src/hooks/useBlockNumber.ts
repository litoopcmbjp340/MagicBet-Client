import { useEffect, useRef } from "react";
import useSWR, { responseInterface } from "swr";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { DataType } from "utils/constants";

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

export default function useKeepSWRDataLiveAsBlocksArrive(
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
