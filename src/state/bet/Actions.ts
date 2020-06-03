import {
  TOGGLE_CHOICE,
  TOGGLE_AMOUNT,
  TOGGLE_SLIPPAGE,
  TOGGLE_CURRENCY,
} from "./Constants";

export const toggleBetChoice = (value: number) => {
  return {
    type: TOGGLE_CHOICE,
    value,
  };
};

export const toggleBetAmount = (value: number) => {
  return {
    type: TOGGLE_AMOUNT,
    value,
  };
};

export const toggleBetSlippage = (value: number) => {
  return {
    type: TOGGLE_SLIPPAGE,
    value,
  };
};

export const toggleBetCurrency = (value: string) => {
  return {
    type: TOGGLE_CURRENCY,
    value,
  };
};
