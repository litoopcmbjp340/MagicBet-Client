import { TOGGLE_CREATE_MARKET_MODAL } from "./Constants";

export function ModalReducer(state: any, action: any) {
  switch (action.type) {
    case TOGGLE_CREATE_MARKET_MODAL: {
      return {
        ...state,
        createMarketModalIsOpen: action.payload,
      };
    }

    default:
      return state;
  }
}
