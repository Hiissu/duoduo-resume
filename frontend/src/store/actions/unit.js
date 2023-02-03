import axios from "axios";
import Cookies from "js-cookie";
import { UNITS_MANAGE_URL } from "../../configs/endpoints";
import { checkAuthenticated } from "./auth";
import { MANAGE_UNIT_SUCCESS } from "./types";

export const manageUnit =
  (
    collectionId,
    unitId,
    words,
    phrases,
    sentences,
    unknownWords,
    unknownPhrases,
    unknownSentences
  ) =>
  async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };

    const word_ids = words.map((ele) => ele.id);
    const phrase_ids = phrases.map((ele) => ele.id);
    const sentence_ids = sentences.map((ele) => ele.id);

    const body = JSON.stringify({
      word_ids,
      phrase_ids,
      sentence_ids,
      unknown_words: unknownWords,
      unknown_phrases: unknownPhrases,
      unknown_sentences: unknownSentences,
    });

    try {
      const response = await axios.put(UNITS_MANAGE_URL(unitId), body, config);
      if (response.data.isuccess)
        dispatch({
          type: MANAGE_UNIT_SUCCESS,
          payload: {
            collectionId,
            unitId,
            words: word_ids,
            phrases: phrase_ids,
            sentences: sentence_ids,
            unknown_words: unknownWords,
            unknown_phrases: unknownPhrases,
            unknown_sentences: unknownSentences,
          },
        });

      return response;
    } catch (error) {
      if (error.response) {
        dispatch(checkAuthenticated(error.response));
        return error.response;
      }
    }
  };
