import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
// import { DATETIME_NOW_INT } from "../../configs/functions";
import { CATEGORIES_URL } from "../../configs/endpoints";
import { resetAuth } from "./authSlice";
import { isCategoriesStoreValid } from "../../configs/functions";

const days2Ms = 86400000;
const numDays = 3;

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, thunkAPI) => {
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

      localStorage.setItem(
        "categoriesStore",
        JSON.stringify({
          categories: response.data,
          exp: Date.now() + days2Ms * numDays,
        })
      );

      return response;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const loadCategories = () => async (dispatch, getState) => {
  const { categories } = getState().category;
  const categoriesRaw = localStorage.getItem("categoriesStore");

  if (!isCategoriesStoreValid(categoriesRaw)) {
    const response = await dispatch(getCategories());
    if (response.payload.status === 200) {
      dispatch(setCategories(response.payload.data));
      return;
    }
  }

  // const datetimeNowInt = DATETIME_NOW_INT();
  const timeNowMs = Date.now();
  const categoriesStore = JSON.parse(categoriesRaw);

  if (timeNowMs - categoriesStore.exp > days2Ms * numDays) {
    const response = await dispatch(getCategories());
    if (response.payload.status === 200) {
      dispatch(setCategories(response.payload.data));
    } else {
      dispatch(setCategories(categoriesStore.categories));
    }
    return;
  } else {
    if (categories === null)
      dispatch(setCategories(categoriesStore.categories));
  }
};

const initialState = { categories: null };

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data;
      })
      .addCase(getCategories.rejected, (state, action) => {});
  },
});

export const { setCategories } = categorySlice.actions;

export default categorySlice.reducer;
