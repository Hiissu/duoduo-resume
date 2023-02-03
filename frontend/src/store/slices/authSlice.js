import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { LOGIN_URL, LOGOUT_URL } from "../../configs/endpoints";
import { clearMeowStore, setMeowInitial } from "./userSlice";

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
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
      thunkAPI.dispatch(setMeowInitial(response.data));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
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
    return response;
  } catch (error) {
    if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const initialState = {
  isAuthenticated: null,
  isError: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state, action) => {
      const status = action.payload;
      if (status === 401 || status === 403) {
        clearMeowStore();
        state.isAuthenticated = false;
      }
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setIsError: (state, action) => {
      state.isError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isError = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isError = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        clearMeowStore();
        state.isAuthenticated = false;
        state.isError = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isError = true;
      });
  },
});

export const { resetAuth, setIsAuthenticated, setIsError } = authSlice.actions;

export default authSlice.reducer;
