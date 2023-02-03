import axios from "axios";
import Cookies from "js-cookie";
import {
  WORDS_URL,
  WORD_TRANSLATIONS_CREATE_URL,
  WORD_TRANSLATIONS_DELETE_URL,
  WORD_TRANSLATIONS_GET_URL,
  WORD_TRANSLATIONS_REMOVE_URL,
  WORD_TRANSLATIONS_UPDATE_URL,
  WORD_TRANSLATIONS_USE_URL,
} from "../../configs/endpoints";
import { checkAuthenticated } from "./auth";
import {
  CREATE_WORD_TRAN_SUCCESS,
  DELETE_WORD_TRAN_SUCCESS,
  LOAD_WORDS_SUCCESS,
  REMOVE_WORD_TRAN_SUCCESS,
  SEARCH_WORD_TRAN_SUCCESS,
  UPDATE_WORD_TRAN_SUCCESS,
  USE_WORD_TRAN_SUCCESS,
} from "./types";

export const loadWords = () => async (dispatch, getState) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  try {
    const languageCode = getState().user.languageLearning.language_code;
    const response = await axios.get(WORDS_URL(languageCode), config);
    dispatch({
      type: LOAD_WORDS_SUCCESS,
      payload: { language: languageCode, words: response.data },
    });
    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const getWords = () => async (dispatch, getState) => {
  const dictionaries = getState().word.dictionaries;
  const languageCode = getState().user.languageLearning.language_code;
  const found = dictionaries.find(
    (element) => element.language === languageCode
  );

  if (found !== undefined) return { status: 200, data: found.words };
  else return dispatch(loadWords());
};

export const loadWordTranslations = (wordId) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  try {
    // const meow = getState().user.meow; const courseid = `&courseid=${meow.course_learning_id}`;
    const response = await axios.get(WORD_TRANSLATIONS_GET_URL(wordId), config);
    dispatch({
      type: SEARCH_WORD_TRAN_SUCCESS,
      payload: { id: wordId, translations: response.data },
    });
    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const getWordTranslations = (wordId) => async (dispatch, getState) => {
  const translations = getState().word.translations;
  const found = translations.find((ele) => ele.id === wordId);

  if (found) return { status: 200, data: found };
  else return dispatch(loadWordTranslations(wordId));
};

export const createWordTranslation =
  (wordId, translation) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({ translation: translation });
    try {
      const response = await axios.post(
        WORD_TRANSLATIONS_CREATE_URL(wordId),
        body,
        config
      );

      dispatch({
        type: CREATE_WORD_TRAN_SUCCESS,
        payload: response.data.translation,
      });

      return response;
    } catch (error) {
      if (error.response) dispatch(checkAuthenticated(error.response));
      return error.response;
    }
  };

export const updateWordTranslation =
  (wordId, translationId, translation) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({ translation: translation });
    try {
      const response = await axios.put(
        WORD_TRANSLATIONS_UPDATE_URL(translationId),
        body,
        config
      );

      dispatch({
        type: UPDATE_WORD_TRAN_SUCCESS,
        payload: { word_id: wordId, translation: response.data.translation },
      });

      return response;
    } catch (error) {
      if (error.response) dispatch(checkAuthenticated(error.response));
      return error.response;
    }
  };

export const deleteWordTranslation =
  (wordId, translationId) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    try {
      const response = await axios.delete(
        WORD_TRANSLATIONS_DELETE_URL(translationId),
        config
      );

      dispatch({
        type: DELETE_WORD_TRAN_SUCCESS,
        payload: { word_id: wordId, tran_id: translationId },
      });

      return response;
    } catch (error) {
      if (error.response) dispatch(checkAuthenticated(error.response));
      return error.response;
    }
  };

export const uweWordTranslation = (wordId, translation) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  const body = JSON.stringify({});
  try {
    const response = await axios.post(
      WORD_TRANSLATIONS_USE_URL(translation.id),
      body,
      config
    );

    dispatch({
      type: USE_WORD_TRAN_SUCCESS,
      payload: { word_id: wordId, translation: translation },
    });

    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const removeWordTranslation =
  (wordId, translationId) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({});
    try {
      const response = await axios.delete(
        WORD_TRANSLATIONS_REMOVE_URL(translationId),
        body,
        config
      );

      dispatch({
        type: REMOVE_WORD_TRAN_SUCCESS,
        payload: { word_id: wordId, tran_id: translationId },
      });

      return response;
    } catch (error) {
      if (error.response) dispatch(checkAuthenticated(error.response));
      return error.response;
    }
  };

export const loadTranslationV1 = (paramsUrl) => async (dispatch) => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&${paramsUrl}`;
  //  &dj=1&dt=t&dt=bd

  try {
    const response = await axios.get(url);
    return { status: 200, data: response.data };
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const loadTranslationV2 = (paramsUrl) => async (dispatch) => {
  const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&${paramsUrl}`;

  try {
    const response = await axios.get(url);
    return { status: 200, data: response.data };
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};
