import Cookies from "js-cookie";
import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CLEAR_MESSAGE_REGISTER,
} from "./types";

import { REGISTER_URL } from "../../configs/endpoints";

export const register =
  (username, email, password, courseid) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({
      username,
      email,
      password,
      courseid,
    });

    try {
      const response = await axios.post(REGISTER_URL, body, config);
      if (response.data.isuccess)
        dispatch({
          type: REGISTER_SUCCESS,
          payload: { message: response.data.message },
        });
      else
        dispatch({
          type: REGISTER_FAIL,
          payload: { message: response.data.message },
        });

      return response.data;
    } catch (error) {
      return {
        isuccess: false,
        message: "Something went wrong when registering",
      };
    }
  };

export const clearMessageRegister = () => async (dispatch) => {
  dispatch({
    type: CLEAR_MESSAGE_REGISTER,
  });
};
