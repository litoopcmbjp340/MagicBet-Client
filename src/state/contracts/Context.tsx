import React, { createContext, useReducer, Dispatch } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

import { ContractReducer } from './Reducers';
import IERC20 from 'abis/IERC20.json';
import addresses, { KOVAN_ID } from 'utils/addresses';
import DaiMockup from 'abis/DaiMockup.json';

// const daiAddress = addresses[KOVAN_ID].tokens.DAI;

const initialContractState: any = [];

// const DaiInstance: any = new Contract(daiAddress, IERC20.abi, wallet);

// initialContractState.push(DaiInstance);

// const DaiMockupInstance: any = new Contract(daiAddress, DaiMockup.abi, wallet);
// initialContractState.push(DaiMockupInstance);

export const ContractContext = createContext<{
  contractState: any;
}>({ contractState: initialContractState });

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
