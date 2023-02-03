import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { resetAuth, setIsAuthenticated } from "./authSlice";
import {
  MEOW_URL,
  PASSWORD_UPDATE_URL,
  USERNAME_CHANGE_URL,
  USERNAME_EXIST_URL,
} from "../../configs/endpoints";
import { getCourses } from "./courseSlice";
import { loadCategories } from "./categorySlice";

export const setMeowStore = (data) => async (dispatch, getState) => {
  localStorage.setItem("meowStore", JSON.stringify(data));
};

export const clearMeowStore = () => async (dispatch, getState) => {
  localStorage.removeItem("meowStore");
};

export const changeCourseLearning = (course) => async (dispatch, getState) => {
  const { meow } = getState().user;
  const newoem = { ...meow, course_learning_id: course.id };
  dispatch(setMeowStore(newoem));
  dispatch(setMeowInitial(newoem));
};

export const getMeow = createAsyncThunk("user/getMeow", async (_, thunkAPI) => {
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
    thunkAPI.dispatch(setIsAuthenticated(true));
    thunkAPI.dispatch(getCourses());
    thunkAPI.dispatch(loadCategories());
    thunkAPI.dispatch(setMeowStore(response.data));

    return response.data;
  } catch (error) {
    if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
    // no need cause resetAuth already do that
    // thunkAPI.dispatch(setIsAuthenticated(false));
    // thunkAPI.dispatch(clearMeowStore());

    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const existUsername = createAsyncThunk(
  "user/existUsername",
  async ({ username }, thunkAPI) => {
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
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const changeUsername = createAsyncThunk(
  "user/changeUsername",
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
      const response = await axios.put(USERNAME_CHANGE_URL, body, config);

      const { meow } = thunkAPI.getState().user;
      const newoem = { ...meow, username };
      thunkAPI.dispatch(setMeowStore(newoem));
      thunkAPI.dispatch(setMeowInitial(newoem));

      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async ({ password, new_password }, thunkAPI) => {
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
      const response = await axios.put(PASSWORD_UPDATE_URL, body, config);
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  isError: false,
  message: null,
  meow: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMeowInitial: (state, action) => {
      state.meow = action.payload;
    },
    resetInitial: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMeow.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getMeow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.meow = action.payload;
      })
      .addCase(getMeow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(existUsername.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(existUsername.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(existUsername.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })

      .addCase(changeUsername.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(changeUsername.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(changeUsername.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })

      .addCase(updatePassword.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      });
  },
});

export const { setMeowInitial, resetInitial } = userSlice.actions;

export default userSlice.reducer;
