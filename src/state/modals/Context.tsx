import React, { createContext, useReducer, Dispatch } from "react";

import { ModalReducer } from "./Reducers";

const initialModalState: any = {
  createMarketModalIsOpen: false,
  infoModalIsOpen: false,
  betSettingsModalIsOpen: false,
};

export const ModalContext = createContext<{
  modalState: any;
  modalDispatch: Dispatch<any>;
}>({ modalState: initialModalState, modalDispatch: () => null });

export const ModalProvider = ({ children }: any) => {
  const [modalState, modalDispatch] = useReducer<typeof ModalReducer>(
    ModalReducer,
    initialModalState
  );

  return (
    <ModalContext.Provider value={{ modalState, modalDispatch }}>
      {children}
    </ModalContext.Provider>
  );
};
