import { LOAD_LANGUAGES_SUCCESS } from "../actions/types";

const initialState = {
  languages: [],
};

export default function LanguageReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_LANGUAGES_SUCCESS:
      return {
        ...state,
        languages: payload,
      };
    default:
      return state;
  }
}
