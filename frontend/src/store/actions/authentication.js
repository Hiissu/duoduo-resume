import axios from "axios";
import Cookies from "js-cookie";
import { checkAuthenticated } from "./auth";
import { clearMeowStore, saveMeowStore } from "./user";

import {
  AUTHENTICATED_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
} from "./types";

import {
  AUTHENTICATED_URL,
  LOGIN_URL,
  LOGOUT_URL,
} from "../../configs/endpoints";

/* @deprecated checkAuthenticated */
export const checkAuth = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  try {
    const response = await axios.get(AUTHENTICATED_URL, config);
    dispatch({ type: AUTHENTICATED_SUCCESS });

    return response;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    return error.response;
  }
};

export const login = (username, password) => async (dispatch) => {
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
    const response = await axios.post(LOGIN_URL, body, config);
    if (response.data.isuccess) {
      dispatch({ type: LOGIN_SUCCESS });
      dispatch(saveMeowStore(response.data));
    } else dispatch({ type: LOGIN_FAIL });

    return response.data;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    dispatch({ type: LOGIN_FAIL });
    return error.response;
  }
};

export const logout = () => async (dispatch) => {
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
    const response = await axios.post(LOGOUT_URL, body, config);
    if (response.data.isuccess) {
      dispatch({ type: LOGOUT_SUCCESS });
      dispatch(clearMeowStore());
    } else dispatch({ type: LOGOUT_FAIL });

    return response.data;
  } catch (error) {
    if (error.response) dispatch(checkAuthenticated(error.response));
    dispatch({ type: LOGOUT_FAIL });
    return error.response;
  }
};
