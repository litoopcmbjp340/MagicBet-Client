import { CREATE_MARKET_CONTRACT } from "./Constants";

export function ContractReducer(state: any, action: any) {
  switch (action.type) {
    case CREATE_MARKET_CONTRACT: {
      return {
        ...state,
      };
    }

    default:
      return state;
  }
}
