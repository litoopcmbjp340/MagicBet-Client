import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

import MBMarketFactoryContract from 'abis/MBMarketFactory.json';

import { ContractReducer } from './Reducers';
import IERC20 from 'abis/IERC20.json';
import addresses, { KOVAN_ID } from 'utils/addresses';

// Since we are using next, we can only use the interface instance (not able to grab the wallet)
const FactoryContract = new Contract(
  addresses[KOVAN_ID].marketFactory,
  MBMarketFactoryContract.abi
);

const initialContractState: any = [];

initialContractState.push(FactoryContract);

export const ContractContext = createContext<{
  contracts: any;
  dispatch: any;
}>({ contracts: initialContractState, dispatch: ContractReducer });

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [contracts, dispatch] = useReducer(
    ContractReducer,
    initialContractState
  );

  return (
    <ContractContext.Provider value={{ contracts, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
};

// return useMemo(
//   () =>
//     !!library
//       ? new Contract(
//           factoryAddress,
//           MBMarketFactoryContract.abi,
//           library.getSigner(account!)
//         )
//       : undefined,
//   [library, account]
// );
