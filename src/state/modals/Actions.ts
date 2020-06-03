import {
  TOGGLE_CREATE_MARKET_MODAL,
  TOGGLE_INFO_MODAL,
  TOGGLE_BET_SETTINGS_MODAL,
} from "./Constants";

export const toggleCreateMarketModal = (value: boolean) => {
  return {
    type: TOGGLE_CREATE_MARKET_MODAL,
    value,
  };
};

export const toggleInfoModal = (value: boolean) => {
  return {
    type: TOGGLE_INFO_MODAL,
    value,
  };
};

export const toggleBetSettingsModal = (value: boolean) => {
  return {
    type: TOGGLE_BET_SETTINGS_MODAL,
    value,
  };
};
