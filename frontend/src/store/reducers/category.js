import {
  LOAD_CATEGORIES_STORE,
  LOAD_CATEGORIES_SUCCESS,
  LOAD_CATEGORIES_FAIL,
} from "../actions/types";

const initialState = {
  categories: null,
};

export default function CategoryReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_CATEGORIES_STORE:
    case LOAD_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: payload,
      };
    case LOAD_CATEGORIES_FAIL:
      return { ...state, categories: [] };
    default:
      return state;
  }
}
