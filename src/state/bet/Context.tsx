import React, { createContext, useReducer, Dispatch } from "react";

import { BetReducer } from "./Reducers";

const initialBetState: any = {
  choice: 0,
  amount: 0,
  slippage: 30,
  currency: "",
};

export const BetContext = createContext<{
  betState: any;
  betDispatch: Dispatch<any>;
}>({ betState: initialBetState, betDispatch: () => null });

export const BetProvider = ({ children }: any) => {
  const [betState, betDispatch] = useReducer<typeof BetReducer>(
    BetReducer,
    initialBetState
  );

  return (
    <BetContext.Provider value={{ betState, betDispatch }}>
      {children}
    </BetContext.Provider>
  );
};
