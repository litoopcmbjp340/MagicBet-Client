import { ADD_MARKET_CONTRACT, DELETE_MARKET_CONTRACT } from './Constants';

export const toggleCreateMarketModal = (value: boolean) => {
  return {
    type: CREATE_MARKET_CONTRACT,
    value,
  };
};
