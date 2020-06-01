import { TOGGLE_CREATE_MARKET_MODAL } from "./Constants";

export const toggleCreateMarketModal = (value: boolean) => {
  return {
    type: TOGGLE_CREATE_MARKET_MODAL,
    value,
  };
};
