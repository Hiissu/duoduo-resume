import axios from "axios";
import Cookies from "js-cookie";
import { LOAD_SENTENCES_SUCCESS } from "./types";
import { SENTENCES_URL } from "../../configs/endpoints";
import { checkAuthenticated } from "./auth";

export const loadSentences = () => async (dispatch, getState) => {
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
    const response = await axios.get(SENTENCES_URL(languageCode), config);
    dispatch({
      type: LOAD_SENTENCES_SUCCESS,
      payload: response.data,
    });
    return { isuccess: true, sentences: response.data };
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response.status));
    return {
      isuccess: false,
      message: error,
    };
  }
};

export const getSentences = () => async (dispatch, getState) => {
  const sentencesInDict = getState().sentence.sentencesInDict;
  const languageCode = getState().user.languageLearning.language_code;

  if (sentencesInDict.some((sid) => sid.language === languageCode)) {
    const sid = sentencesInDict.find((sid) => sid.language === languageCode);
    return { isuccess: true, sentences: sid.sentences };
  } else return dispatch(loadSentences());
};
