import axios from "axios";
import Cookies from "js-cookie";
import { LOAD_PHRASES_SUCCESS } from "./types";
import { PHRASES_URL } from "../../configs/endpoints";
import { checkAuthenticated } from "./auth";

export const loadPhrases = () => async (dispatch, getState) => {
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
    const response = await axios.get(PHRASES_URL(languageCode), config);

    dispatch({
      type: LOAD_PHRASES_SUCCESS,
      payload: response.data,
    });
    return { isuccess: true, phrases: response.data };
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response.status));
    return {
      isuccess: false,
      message: error,
    };
  }
};

export const getPhrases = () => async (dispatch, getState) => {
  const phrasesInDict = getState().phrase.phrasesInDict;
  const languageCode = getState().user.languageLearning.language_code;

  if (phrasesInDict.some((pid) => pid.language === languageCode)) {
    const pid = phrasesInDict.find((pid) => pid.language === languageCode);
    return { isuccess: true, phrases: pid.phrases };
  } else return dispatch(loadPhrases());
};
