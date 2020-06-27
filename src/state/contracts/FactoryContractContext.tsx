import React, { createContext } from 'react';
import { Contract } from '@ethersproject/contracts';

import MBMarketFactoryContract from 'abis/MBMarketFactory.json';
import addresses, { KOVAN_ID } from 'utils/addresses';

// Since we are using next, we can only use the interface instance (not able to grab the wallet)
const FactoryContract = new Contract(
  addresses[KOVAN_ID].marketFactory,
  MBMarketFactoryContract.abi
);

export const FactoryContractContext = createContext<any>(FactoryContract);

export const FactoryContractProvider = ({ children }: any) => {
  return (
    <FactoryContractContext.Provider value={{ FactoryContract }}>
      {children}
    </FactoryContractContext.Provider>
  );
};
