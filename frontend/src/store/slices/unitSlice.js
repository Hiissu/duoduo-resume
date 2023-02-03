import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { UNITS_MANAGE_URL } from "../../configs/endpoints";
import { resetAuth } from "./authSlice";
import { updateUnitInCollections } from "./collectionSlice";

export const manageUnit = createAsyncThunk(
  "unit/manageUnit",
  async (
    {
      collection_id,
      unit_id,
      words,
      phrases,
      sentences,
      unknown_words,
      unknown_phrases,
      unknown_sentences,
    },
    thunkAPI
  ) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };

    // const {managementState} = thunkAPI.getState().unitManagement;

    const word_ids = words.map((ele) => ele.id);
    const phrase_ids = phrases.map((ele) => ele.id);
    const sentence_ids = sentences.map((ele) => ele.id);

    const payload = {
      word_ids,
      phrase_ids,
      sentence_ids,
      unknown_words,
      unknown_phrases,
      unknown_sentences,
    };
    const body = JSON.stringify(payload);
    try {
      const response = await axios.put(UNITS_MANAGE_URL(unit_id), body, config);

      thunkAPI.dispatch(
        updateUnitInCollections(collection_id, unit_id, payload)
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
  isError: false,
  units: [],
  unitsLearning: null,
};

export const unitSlice = createSlice({
  name: "unit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(manageUnit.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(manageUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(manageUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

// export const {} = unitSlice.actions;

export default unitSlice.reducer;
