import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CLEAR_MESSAGE_REGISTER,
} from "../actions/types";

const initialState = {
  message: null,
};

export default function RegisterReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        message: payload.message,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        message: payload.message,
      };
    case CLEAR_MESSAGE_REGISTER:
      return { ...state, message: null };
    default:
      return state;
  }
}
