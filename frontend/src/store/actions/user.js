import axios from "axios";
import Cookies from "js-cookie";
import {
  EMAIL_CHANGE_URL,
  EMAIL_CHANGE_VERIFY_URL,
  EMAIL_VERIFICATIONS_URL,
  EMAIL_VERIFICATIONS_VERIFY_URL,
  MEOW_URL,
  PASSWORD_RESET_URL,
  PASSWORD_RESET_VERIFY_URL,
  PASSWORD_UPDATE_URL,
  PROFILE_DETAIL_URL,
  PROFILE_UPDATE_URL,
  USERNAME_CHANGE_URL,
  USERNAME_EXIST_URL,
} from "../../configs/endpoints";
import { checkAuthenticated } from "./auth";
import {
  AUTHENTICATED_SUCCESS,
  CHANGE_EMAIL_SUCCESS,
  CHANGE_USERNAMME_SUCCESS,
  JUST_CHANGE_EMAIL_SUCCESS,
  LOAD_MEOW_FAIL,
  LOAD_MEOW_STORE,
  LOAD_MEOW_SUCCESS,
  UPDATE_POINTS_IN_LEARNED,
  UPDATE_PROFILE_SUCCESS,
  VERIFY_EMAIL_SUCCESS,
} from "./types";

export const loadMeow = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };

  try {
    const response = await axios.get(MEOW_URL, config);
    dispatch({ type: AUTHENTICATED_SUCCESS });
    dispatch({ type: LOAD_MEOW_SUCCESS, payload: response.data });
    dispatch({ type: LOAD_MEOW_STORE, payload: response.data });
    dispatch(saveMeowStore(response.data));

    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    dispatch({ type: LOAD_MEOW_FAIL });
    return error.response;
  }
};

export const saveMeowStore = (response) => async () => {
  localStorage.setItem("meowStore", JSON.stringify(response));
};

export const clearMeowStore = () => async (dispatch) => {
  localStorage.removeItem("meowStore");
};

/* @deprecated */
export const getMeow = () => async (dispatch, getState) => {
  const meow = getState().user.meow;
  const meowStore = JSON.parse(localStorage.getItem("meowStore"));

  if (localStorage.meowStore) {
    const keys = [
      "uid",
      "username",
      "date_joined",
      "last_login",
      "name",
      "avatar",
      "bio",
      "day_streak",
      "email",
      "email_verified",
      "course_learning_id",
      "courses_learning_ids",
      "is_premium",
      "is_moderator",
    ];

    if (keys.some((key) => !meowStore.hasOwnProperty(key))) {
      dispatch(clearMeowStore());
      const response = await dispatch(loadMeow());
      return response;
    } else if (
      typeof meowStore.uid !== "number" ||
      typeof meowStore.username !== "string" ||
      typeof meowStore.date_joined !== "string" ||
      typeof meowStore.last_login !== "string" ||
      typeof meowStore.name !== "string" ||
      typeof meowStore.avatar !== "string" ||
      typeof meowStore.bio !== "string" ||
      typeof meowStore.day_streak !== "number" ||
      typeof meowStore.course_learning_id !== "number" ||
      typeof meowStore.courses_learning_ids !== "object" ||
      typeof meowStore.email !== "string" ||
      typeof meowStore.email_verified !== "boolean" ||
      typeof meowStore.is_premium !== "boolean" ||
      typeof meowStore.is_moderator !== "boolean"
    ) {
      dispatch(clearMeowStore());
      const response = await dispatch(loadMeow());
      return response;
    }

    if (meow === null) {
      dispatch({ type: LOAD_MEOW_STORE, payload: meowStore });
      return meowStore;
    }
  } else {
    const response = await dispatch(loadMeow());
    if (response.isuccess) return response;
    else return {};
  }
};

export const updatePointsInLearned =
  (wordRecords, phraseRecords, sentenceRecords) =>
  async (dispatch, getState) => {
    const languageLearning = getState().user.languageLearning.language_code;
    dispatch({
      type: UPDATE_POINTS_IN_LEARNED,
      payload: {
        wordRecords,
        phraseRecords,
        sentenceRecords,
        languageLearning,
      },
    });
  };

export const loadProfile = (username) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  try {
    const response = await axios.get(PROFILE_DETAIL_URL(username), config);
    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const updateProfile =
  (avatar, name, bio) => async (dispatch, getState) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };

    const payload = { name, avatar, bio };
    const body = JSON.stringify(payload);

    try {
      const response = await axios.patch(PROFILE_UPDATE_URL, body, config);
      dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: payload });

      const meow = getState().user.meow;
      const newMeow = { ...meow, name, avatar, bio };
      localStorage.setItem("meowStore", JSON.stringify(newMeow));

      return response;
    } catch (error) {
      if (error.response) dispatch(checkAuthenticated(error.response));
      return error.response;
    }
  };

export const verifyEmail = (email) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  const body = JSON.stringify({ email });
  try {
    const response = await axios.post(EMAIL_VERIFICATIONS_URL, body, config);
    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const confirmEmail =
  (email, verification_code) => async (dispatch, getState) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({ email, verification_code });
    try {
      const response = await axios.post(
        EMAIL_VERIFICATIONS_VERIFY_URL,
        body,
        config
      );

      dispatch({ type: VERIFY_EMAIL_SUCCESS });

      const meow = getState().user.meow;
      const newMeow = { ...meow, email_verified: true };
      localStorage.setItem("meowStore", JSON.stringify(newMeow));

      return response;
    } catch (error) {
      if (error.response) dispatch(checkAuthenticated(error.response));
      return error.response;
    }
  };

export const requestChangeEmail = () => async (dispatch) => {
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
    const response = await axios.post(EMAIL_CHANGE_URL, body, config);
    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const justChangeEmail =
  (email, password) => async (dispatch, getState) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({ email, password });
    try {
      const response = await axios.put(EMAIL_CHANGE_URL, body, config);
      dispatch({ type: JUST_CHANGE_EMAIL_SUCCESS, payload: email });

      const meow = getState().user.meow;
      const newMeow = { ...meow, email, email_verified: false };
      localStorage.setItem("meowStore", JSON.stringify(newMeow));

      return response;
    } catch (error) {
      if (error.response) dispatch(checkAuthenticated(error.response));
      return error.response;
    }
  };

export const confirmChangeEmail =
  (email, password, verification_code) => async (dispatch, getState) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({ email, password, verification_code });
    try {
      const response = await axios.post(EMAIL_CHANGE_VERIFY_URL, body, config);
      dispatch({ type: CHANGE_EMAIL_SUCCESS, payload: email });

      const meow = getState().user.meow;
      const newMeow = { ...meow, email, email_verified: true };
      localStorage.setItem("meowStore", JSON.stringify(newMeow));

      return response;
    } catch (error) {
      if (error.response) dispatch(checkAuthenticated(error.response));
      return error.response;
    }
  };

export const existUsername = (username) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  const body = JSON.stringify({ username });
  try {
    const response = await axios.post(USERNAME_EXIST_URL, body, config);
    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const changeUsername =
  (username, password) => async (dispatch, getState) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({ username, password });
    try {
      const response = await axios.put(USERNAME_CHANGE_URL, body, config);
      dispatch({ type: CHANGE_USERNAMME_SUCCESS, payload: username });

      const meow = getState().user.meow;
      const newMeow = { ...meow, username };
      localStorage.setItem("meowStore", JSON.stringify(newMeow));

      return response;
    } catch (error) {
      if (error.response) dispatch(checkAuthenticated(error.response));
      return error.response;
    }
  };

export const updatePassword = (password, new_password) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  const body = JSON.stringify({ password, new_password });
  try {
    const response = await axios.patch(PASSWORD_UPDATE_URL, body, config);
    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const resetPassword = (email) => async () => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  const body = JSON.stringify({ email });
  try {
    const response = await axios.post(PASSWORD_RESET_URL, body, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const confirmResetPassword = (token, password) => async () => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  const body = JSON.stringify({ password, token });
  try {
    const response = await axios.post(PASSWORD_RESET_VERIFY_URL, body, config);
    return response;
  } catch (error) {
    return error.response;
  }
};
