import { LOAD_SENTENCES_SUCCESS } from "../actions/types";

const initialState = {
  sentencesInDict: [],
  sentencesInCollection: [],
};

export default function SentenceReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_SENTENCES_SUCCESS:
      return {
        ...state,
        sentencesInDict: [
          ...state.sentencesInDict,
          { language: payload.language, sentences: payload.sentences },
        ],
      };

    default:
      return state;
  }
}
