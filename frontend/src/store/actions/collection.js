import axios from "axios";
import Cookies from "js-cookie";
import {
  COLLECTIONS_CREATE_URL,
  COLLECTIONS_DELETE_URL,
  COLLECTIONS_DETAIL_URL,
  COLLECTIONS_LEARNING_URL,
  COLLECTIONS_LEARN_URL,
  COLLECTIONS_REMOVE_URL,
  COLLECTIONS_REVIEW_URL,
  COLLECTIONS_SEARCH_URL,
  COLLECTIONS_URL,
} from "../../configs/endpoints";
import { checkAuthenticated } from "./auth";
import {
  CREATE_COLLECTION_SUCCESS,
  DELETE_COLLECTION_SUCCESS,
  LEARN_COLLECTION_SUCCESS,
  LOAD_COLLECTIONS_LEARNING_FAIL,
  LOAD_COLLECTIONS_LEARNING_SUCCESS,
  LOAD_COLLECTION_SUCCESS,
  LOAD_REVIEW_COLLECTION_SUCCESS,
  REMOVE_COLLECTION_SUCCESS,
  UPDATE_POINTS_IN_COLLECTION,
} from "./types";

export const loadCollectionsLearning = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  try {
    const response = await axios.get(COLLECTIONS_LEARNING_URL, config);
    dispatch({
      type: LOAD_COLLECTIONS_LEARNING_SUCCESS,
      payload: response.data,
    });

    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    dispatch({
      type: LOAD_COLLECTIONS_LEARNING_FAIL,
    });
    return error.response;
  }
};

export const loadCollections = (pageParamUrl) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  try {
    const response = await axios.get(COLLECTIONS_URL(pageParamUrl), config);
    return response.data;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response.status));

    return {
      isuccess: false,
      message: error,
    };
  }
};

export const searchCollections = (searchParamsUrl) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  try {
    const response = await axios.get(
      COLLECTIONS_SEARCH_URL(searchParamsUrl),
      config
    );
    return response.data;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response.status));

    return {
      isuccess: false,
      message: error,
    };
  }
};

export const loadCollectionDetail = (collectionId) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  try {
    const response = await axios.get(
      COLLECTIONS_DETAIL_URL(collectionId),
      config
    );
    dispatch({ type: LOAD_COLLECTION_SUCCESS, payload: response.data });

    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const getCollectionDetail =
  (collectionId) => async (dispatch, getState) => {
    const collections = getState().collection.collections;

    if (collections.some((collection) => collection.id === collectionId))
      return {
        status: 200,
        data: collections.find((collection) => collection.id === collectionId),
      };
    else return dispatch(loadCollectionDetail(collectionId));
  };

export const loadCollectionReviews = (collectionId) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  try {
    const response = await axios.get(
      COLLECTIONS_REVIEW_URL(collectionId),
      config
    );
    dispatch({
      type: LOAD_REVIEW_COLLECTION_SUCCESS,
      payload: { collectionId: collectionId, reviews: response.data },
    });

    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const getCollectionReviews =
  (collectionId) => async (dispatch, getState) => {
    const reviews = getState().collection.reviews;

    if (reviews.some((review) => review.collectionId === collectionId))
      return {
        status: 200,
        data: reviews.find((review) => review.collectionId === collectionId),
      };
    else return dispatch(loadCollectionReviews(collectionId));
  };

export const createCollection = (collection) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  const body = JSON.stringify({
    name: collection.collectionName,
    banner_url: collection.collectionBannerUrl,
    description: collection.collectionDesc,
    topics_ids: collection.collectionTopics.map((topic) => topic.id),
  });
  try {
    const response = await axios.post(COLLECTIONS_CREATE_URL, body, config);
    dispatch({
      type: CREATE_COLLECTION_SUCCESS,
      payload: response.data,
    });

    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const learnCollection = (collection) => async (dispatch) => {
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
      COLLECTIONS_LEARN_URL(collection.id),
      body,
      config
    );
    if (response.data.isuccess)
      dispatch({
        type: LEARN_COLLECTION_SUCCESS,
        payload: collection,
      });

    return response.data;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response.status));
    return {
      isuccess: false,
      message: error,
    };
  }
};

export const removeCollection = (collection) => async (dispatch) => {
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
      COLLECTIONS_REMOVE_URL(collection.id),
      body,
      config
    );
    if (response.data.isuccess)
      dispatch({
        type: REMOVE_COLLECTION_SUCCESS,
        payload: collection,
      });

    return response.data;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response.status));
    return {
      isuccess: false,
      message: error,
    };
  }
};

export const deleteCollection = (collection) => async (dispatch) => {
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
      COLLECTIONS_DELETE_URL(collection.id),
      body,
      config
    );
    if (response.data.isuccess)
      dispatch({ type: DELETE_COLLECTION_SUCCESS, payload: collection });

    return response.data;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response.status));
    return { isuccess: false, message: error };
  }
};

export const updatePointsInUnit =
  (
    collectionId,
    unknownWordsInUnit,
    unknownPhrasesInUnit,
    unknownSentencesInUnit
  ) =>
  async (dispatch) => {
    dispatch({
      type: UPDATE_POINTS_IN_COLLECTION,
      payload: {
        collection_id: collectionId,
        unknownWordsInUnit,
        unknownPhrasesInUnit,
        unknownSentencesInUnit,
      },
    });
  };
