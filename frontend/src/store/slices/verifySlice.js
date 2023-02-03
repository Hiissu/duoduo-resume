import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { resetAuth } from "./authSlice";
import { setMeowInitial, setMeowStore, userSlice } from "./userSlice";

import {
  EMAIL_CHANGE_URL,
  EMAIL_CHANGE_VERIFY_URL,
  EMAIL_VERIFICATIONS_URL,
  EMAIL_VERIFICATIONS_VERIFY_URL,
  PASSWORD_RESET_URL,
  PASSWORD_RESET_VERIFY_URL,
} from "../../configs/endpoints";

export const confirmEmail = createAsyncThunk(
  "verify/confirmEmail",
  async ({ email, verification_code }, thunkAPI) => {
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

      const { meow } = thunkAPI.getState().user;
      const newoem = { ...meow, email_verified: true };
      thunkAPI.dispatch(setMeowStore(newoem));
      thunkAPI.dispatch(setMeowInitial(newoem));

      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "verify/verifyEmail",
  async ({ email }, thunkAPI) => {
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
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const requestChangeEmail = createAsyncThunk(
  "verify/requestChangeEmail",
  async (_, thunkAPI) => {
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
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const justChangeEmail = createAsyncThunk(
  "verify/justChangeEmail",
  async ({ email, password }, thunkAPI) => {
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

      const { meow } = thunkAPI.getState().user;
      const newoem = { ...meow, email, email_verified: false };
      thunkAPI.dispatch(setMeowStore(newoem));
      thunkAPI.dispatch(setMeowInitial(newoem));

      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const confirmChangeEmail = createAsyncThunk(
  "verify/confirmChangeEmail",
  async ({ email, password, verification_code }, thunkAPI) => {
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

      const { meow } = thunkAPI.getState().user;
      const newoem = { ...meow, email, email_verified: true };
      thunkAPI.dispatch(setMeowStore(newoem));
      thunkAPI.dispatch(setMeowInitial(newoem));

      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "verify/resetPassword",
  async ({ email }, thunkAPI) => {
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
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const confirmResetPassword = createAsyncThunk(
  "verify/confirmResetPassword",
  async ({ token, password }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({ token, password });
    try {
      const response = await axios.post(
        PASSWORD_RESET_VERIFY_URL,
        body,
        config
      );
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  isError: null,
  message: null,
};

export const verifySlice = createSlice({
  name: "verify",
  initialState,
  reducers: {
    resetInitial: (state, action) => {
      state.isLoading = false;
      state.isError = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmEmail.pending, (state, action) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(confirmEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })

      .addCase(verifyEmail.pending, (state, action) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })

      .addCase(requestChangeEmail.pending, (state, action) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(requestChangeEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(requestChangeEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })

      .addCase(justChangeEmail.pending, (state, action) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(justChangeEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(justChangeEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })

      .addCase(confirmChangeEmail.pending, (state, action) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(confirmChangeEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(confirmChangeEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })

      .addCase(resetPassword.pending, (state, action) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })

      .addCase(confirmResetPassword.pending, (state, action) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(confirmResetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })
      .addCase(confirmResetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      });
  },
});

export const { resetInitial } = verifySlice.actions;

export default verifySlice.reducer;
