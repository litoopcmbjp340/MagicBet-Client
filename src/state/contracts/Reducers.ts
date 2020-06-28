import { ADD_MARKET_CONTRACT, DELETE_MARKET_CONTRACT } from './Constants';

export const ContractReducer = (state: any, action: any) => {
  switch (action.type) {
    case ADD_MARKET_CONTRACT:
      return [
        ...state,
        {
          title: action.book.title,
          author: action.book.author,
        },
      ];
    case DELETE_MARKET_CONTRACT:
      return state.filter(
        (marketContract: any) => marketContract.address !== action.address
      );
    default:
      return state;
  }
};
