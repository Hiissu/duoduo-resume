import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { resetAuth } from "./authSlice";
import {
  WORDS_URL,
  WORD_TRANSLATIONS_CREATE_URL,
  WORD_TRANSLATIONS_DELETE_URL,
  WORD_TRANSLATIONS_GET_URL,
  WORD_TRANSLATIONS_REMOVE_URL,
  WORD_TRANSLATIONS_UPDATE_URL,
  WORD_TRANSLATIONS_USE_URL,
} from "../../configs/endpoints";
import { setWordsIn } from "./unitManagementSlice";

export const getWords = createAsyncThunk(
  "word/getWords",
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
      const languageCode =
        thunkAPI.getState().course.language_learning.language_code;

      const response = await axios.get(WORDS_URL(languageCode), config);
      const words = response.data;

      thunkAPI.dispatch(id2WordsIn(words));

      return { language: languageCode, words };
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const id2WordsIn = (wordsInDict) => async (dispatch, getState) => {
  const { wordIdsInUnit } = getState().unitManagement;

  const wordsInUnit = wordsInDict.filter((element) =>
    wordIdsInUnit.some((id) => id === element.id)
  );

  dispatch(setWordsIn({ wordsInUnit, wordsInDict }));
};

export const findWordsInDict = () => async (dispatch, getState) => {
  const languageCode = getState().course.language_learning.language_code;
  const { dictionaries } = getState().word;

  const found = dictionaries.find(
    (dictionary) => dictionary.language === languageCode
  );

  if (found) dispatch(id2WordsIn(found.words));
  else dispatch(getWords());
};

export const getWordTranslations = createAsyncThunk(
  "word/getWordTranslations",
  async ({ wordId }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    try {
      const response = await axios.get(
        WORD_TRANSLATIONS_GET_URL(wordId),
        config
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const findWordTranslations = (wordId) => async (dispatch, getState) => {
  const { translations } = getState().word;
  const found = translations.find((ele) => ele.word_id === wordId);

  if (found) return { payload: found };
  else return dispatch(getWordTranslations({ wordId }));
};

export const createWordTranslation = createAsyncThunk(
  "word/createWordTranslation",
  async ({ wordId, translation }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({ translation: translation });
    try {
      const response = await axios.post(
        WORD_TRANSLATIONS_CREATE_URL(wordId),
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

export const updateWordTranslation = createAsyncThunk(
  "word/updateWordTranslation",
  async ({ wordId, translationId, translation }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({ translation });
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.put(
        WORD_TRANSLATIONS_UPDATE_URL(translationId),
        body,
        config
      );

      return { word_id: wordId, translation };
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteWordTranslation = createAsyncThunk(
  "word/deleteWordTranslation",
  async ({ translationId }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.delete(
        WORD_TRANSLATIONS_DELETE_URL(translationId),
        config
      );

      return translationId;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  isError: false,
  dictionaries: [],
  translations: [],
};

export const wordSlice = createSlice({
  name: "word",
  initialState,
  reducers: {
    resetInitial: (state, action) => {
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWords.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getWords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.dictionaries.unshift(action.payload);
      })
      .addCase(getWords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(getWordTranslations.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getWordTranslations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.translations.unshift(action.payload);
      })
      .addCase(getWordTranslations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(createWordTranslation.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createWordTranslation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.translations.unshift(action.payload);
      })
      .addCase(createWordTranslation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(updateWordTranslation.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateWordTranslation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        const neu = state.translations.map((element) =>
          element.word_id === action.payload.word_id
            ? {
                ...element,
                translation: action.payload.translation,
              }
            : element
        );
        state.translations = neu;
      })
      .addCase(updateWordTranslation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(deleteWordTranslation.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteWordTranslation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        const neu = state.translations.filter(
          (element) => element.id !== action.payload
        );
        state.translations = neu;
      })
      .addCase(deleteWordTranslation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { resetInitial } = wordSlice.actions;

export default wordSlice.reducer;
