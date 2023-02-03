import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { REGISTER_URL } from "../../configs/endpoints";

export const register = createAsyncThunk(
  "register/register",
  async ({ username, email, password, courseid }, thunkAPI) => {
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
      thunkAPI.dispatch(resetRegister());

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  message: null,
  isError: false,
  isRegistered: false,
  isInForm: false,
  courseId: -1,
  courseName: "",
  courseFlag: "",
  username: "",
  email: "",
  password: "",
  repassword: "",
};

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetMessage: (state, action) => {
      state.message = null;
      state.isRegistered = false;
    },
    resetRegister: (state, action) => {
      state.isInForm = false;
      state.isRegistered = false;
      state.courseId = -1;
      state.courseName = "";
      state.courseFlag = "";
      state.username = "";
      state.email = "";
      state.password = "";
      state.repassword = "";
    },
    setIsInForm: (state, action) => {
      state.isInForm = !state.isInForm;
    },
    setCourseRegister: (state, action) => {
      state.courseId = action.payload.id;
      state.courseName = action.payload.name;
      state.courseFlag = action.payload.flag;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setRepassword: (state, action) => {
      state.repassword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isError = false;
        state.isRegistered = true;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.isError = true;
        state.isRegistered = false;
        state.message = action.payload.message;
      });
  },
});

export const {
  resetMessage,
  resetRegister,
  setIsInForm,
  setCourseRegister,
  setUsername,
  setEmail,
  setPassword,
  setRepassword,
} = registerSlice.actions;

export default registerSlice.reducer;
