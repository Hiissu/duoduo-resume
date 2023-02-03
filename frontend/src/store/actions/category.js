import axios from "axios";
import Cookies from "js-cookie";
import { DATETIME_NOW_INT } from "../../configs/functions";
import { CATEGORIES_URL } from "../../configs/endpoints";
import { checkAuthenticated } from "./auth";
import {
  LOAD_CATEGORIES_FAIL,
  LOAD_CATEGORIES_STORE,
  LOAD_CATEGORIES_SUCCESS,
} from "./types";

export const getCategories = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  try {
    const response = await axios.get(CATEGORIES_URL, config);
    dispatch({ type: LOAD_CATEGORIES_SUCCESS, payload: response.data });

    localStorage.setItem(
      "categoriesStore",
      JSON.stringify({
        categories: response.data,
        dateUpdated: DATETIME_NOW_INT(),
      })
    );

    return response;
  } catch (error) {
    console.log(error);
    if (error.response) dispatch(checkAuthenticated(error.response));
    dispatch({ type: LOAD_CATEGORIES_FAIL });
    return error.response;
  }
};

export const loadCategoriesStore = (categoriesStore) => async (dispatch) => {
  dispatch({ type: LOAD_CATEGORIES_STORE, payload: categoriesStore });
};

export const loadCategories = () => async (dispatch, getState) => {
  const categories = getState().category.categories;
  const categoriesStore = JSON.parse(localStorage.getItem("categoriesStore"));

  if (localStorage.categoriesStore) {
    const keys = ["categories", "dateUpdated"];
    if (keys.some((key) => !categoriesStore.hasOwnProperty(key))) {
      const response = await dispatch(getCategories());
      if (response.status === 200) {
        dispatch(loadCategoriesStore(response.data));
        return response.data;
      }
    }

    const datetimeNowInt = DATETIME_NOW_INT();
    if (datetimeNowInt - categoriesStore.dateUpdated > 1) {
      const response = await dispatch(getCategories());
      if (response.status === 200) {
        dispatch(loadCategoriesStore(response.data));
        return response.data;
      } else {
        dispatch(loadCategoriesStore(categoriesStore.categories));
        return categoriesStore.categories;
      }
    } else {
      if (categories === null) {
        dispatch(loadCategoriesStore(categoriesStore.categories));
        return categoriesStore.categories;
      } else return categories;
    }
  } else {
    const response = await dispatch(getCategories());
    if (response.status === 200) {
      dispatch(loadCategoriesStore(response.data));
      return response.data;
    } else return [];
  }
};
