import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import AppReducer from './Reducers';

const initialAppState: any = [];

export const AppContext = createContext<{
  state: any;
  dispatch: any;
}>({ state: initialAppState, dispatch: AppReducer });

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AppReducer, initialAppState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
