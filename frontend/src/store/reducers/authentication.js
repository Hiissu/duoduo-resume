import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
} from "../actions/types";

const initialState = {
  isAuthenticated: null,
};

export default function AuthReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case AUTHENTICATED_SUCCESS:
      if (state.isAuthenticated) return state;
      else return { ...state, isAuthenticated: true };
    case LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true };
    case AUTHENTICATED_FAIL:
    case LOGOUT_SUCCESS:
      return { ...state, isAuthenticated: false };
    case LOGIN_FAIL:
      return { ...state, isAuthenticated: false };
    case LOGOUT_FAIL:
      return state;
    default:
      return state;
  }
}
