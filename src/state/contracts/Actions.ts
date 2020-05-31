import { CREATE_MARKET_CONTRACT } from "./Constants";

export const toggleCreateMarketModal = (value: boolean) => {
  return {
    type: CREATE_MARKET_CONTRACT,
    value,
  };
};
