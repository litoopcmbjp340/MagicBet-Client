import { ADD_OPTIONS, DELETE_OPTIONS } from './Constants';

export const addMarketOptions = (value: boolean) => {
  return {
    type: ADD_OPTIONS,
    value,
  };
};

export const deleteMarketOptions = (value: boolean) => {
  return {
    type: DELETE_OPTIONS,
    value,
  };
};
