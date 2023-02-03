import { LOAD_LANGUAGES_SUCCESS } from "../actions/types";

export const getLanguagesInMeow = () => async (dispatch, getState) => {
  const user = getState().user;
  return {
    language_speaking: user.languageSpeaking.language,
    language_learning: user.languageLearning.language,
  };
};

export const saveLanguages2Reducer = (languages) => async (dispatch) => {
  dispatch({
    type: LOAD_LANGUAGES_SUCCESS,
    payload: languages,
  });
};
