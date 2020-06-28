import { ADD_OPTIONS, DELETE_OPTIONS } from './Constants';

export default function AppReducer(state: any, action: any) {
  switch (action.type) {
    case ADD_OPTIONS:
      return [
        ...state,
        {
          option: action.state.option,
          color: action.state.color,
        },
      ];
    case DELETE_OPTIONS:
      return [];

    default:
      return state;
  }
}
