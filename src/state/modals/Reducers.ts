import {
  TOGGLE_CREATE_MARKET_MODAL,
  TOGGLE_INFO_MODAL,
  TOGGLE_BET_SETTINGS_MODAL,
} from "./Constants";

export function ModalReducer(state: any, action: any) {
  switch (action.type) {
    case TOGGLE_CREATE_MARKET_MODAL: {
      return {
        ...state,
        createMarketModalIsOpen: action.payload,
      };
    }
    case TOGGLE_INFO_MODAL: {
      return {
        ...state,
        infoModalIsOpen: action.payload,
      };
    }
    case TOGGLE_BET_SETTINGS_MODAL: {
      return {
        ...state,
        betSettingsModalIsOpen: action.payload,
      };
    }

    default:
      return state;
  }
}
