import {
  TOGGLE_CHOICE,
  TOGGLE_AMOUNT,
  TOGGLE_SLIPPAGE,
  TOGGLE_CURRENCY,
} from "./Constants";

export function BetReducer(state: any, action: any) {
  switch (action.type) {
    case TOGGLE_CHOICE: {
      return {
        ...state,
        choice: action.payload,
      };
    }
    case TOGGLE_AMOUNT: {
      return {
        ...state,
        amount: action.payload,
      };
    }
    case TOGGLE_SLIPPAGE: {
      return {
        ...state,
        slippage: action.payload,
      };
    }
    case TOGGLE_CURRENCY: {
      return {
        ...state,
        currency: action.payload,
      };
    }

    default:
      return state;
  }
}
