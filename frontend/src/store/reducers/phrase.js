import { LOAD_PHRASES_SUCCESS } from "../actions/types";

const initialState = {
  phrasesInDict: [],
  phrasesInCollection: [],
};

export default function PhraseReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_PHRASES_SUCCESS:
      return {
        ...state,
        phrasesInDict: [
          ...state.phrasesInDict,
          { language: payload.language, phrases: payload.phrases },
        ],
      };

    default:
      return state;
  }
}
