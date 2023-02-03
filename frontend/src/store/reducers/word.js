import { LOAD_WORDS_SUCCESS, SEARCH_WORD_TRAN_SUCCESS } from "../actions/types";

const initialState = {
  dictionaries: [],
  translations: [],
};

export default function WordReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_WORDS_SUCCESS:
      if (!state.dictionaries.some((ele) => ele.language === payload.language))
        return {
          ...state,
          dictionaries: [
            ...state.dictionaries,
            { language: payload.language, words: payload.words },
          ],
        };
      else return state;
    case SEARCH_WORD_TRAN_SUCCESS:
      if (!state.translations.some((ele) => ele.id === payload.id))
        return {
          ...state,
          translations: [
            ...state.translations,
            { id: payload.id, translations: payload.translations },
          ],
        };
      else return state;

    default:
      return state;
  }
}
