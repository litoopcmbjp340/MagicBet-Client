import React, { createContext, useReducer, useMemo, Dispatch } from "react";
import { providers, Contract } from "ethers";

import { ContractReducer } from "./Reducers";
import BTMarketFactoryContract from "abis/BTMarketFactory.json";
import addresses, { KOVAN_ID } from "utils/addresses";

const factoryAddress = addresses[KOVAN_ID].marketFactory;

const initialContractState: any = [];

const provider = new providers.Web3Provider(window.web3.currentProvider);
const wallet = provider.getSigner();
const FactoryContract = new Contract(
  factoryAddress,
  BTMarketFactoryContract.abi,
  wallet
);

initialContractState.push(FactoryContract);

export const ContractContext = createContext<{
  contractState: any;
  contractDispatch: Dispatch<any>;
}>({ contractState: initialContractState, contractDispatch: () => null });

export const ContractProvider = ({ children }: any) => {
  const [contractState, contractDispatch] = useReducer<typeof ContractReducer>(
    ContractReducer,
    initialContractState
  );

  return (
    <ContractContext.Provider value={{ contractState, contractDispatch }}>
      {children}
    </ContractContext.Provider>
  );
};
