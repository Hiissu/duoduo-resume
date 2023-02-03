import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { specialCharsRegex } from "../../configs/constants";
import { array2Fusion } from "../../configs/functions";

export const getMicrosoftTranslateAuth = createAsyncThunk(
  "translator/getMicrosoftTranslateAuth",
  async (_, thunkAPI) => {
    const url = `https://edge.microsoft.com/translate/auth`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const findMicrosoftTranslateAuth = () => async (dispatch, getState) => {
  const { microsoftTranslateAuth, expirationTime } = getState().translator;

  const minutes = 9;
  const minute2Ms = 60000;

  console.log(
    "expirationTime - isExpired",
    expirationTime,
    Date.now() < expirationTime + minutes * minute2Ms
  );

  if (
    microsoftTranslateAuth &&
    Date.now() < expirationTime + minutes * minute2Ms
  )
    return { payload: microsoftTranslateAuth };
  else return dispatch(getMicrosoftTranslateAuth());
};

export const microsoftTranslator = createAsyncThunk(
  "translator/microsoftTranslator",
  async ({ bodyTexts }, thunkAPI) => {
    const response = await thunkAPI.dispatch(findMicrosoftTranslateAuth());

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${response.payload}`,
      },
    };
    const body = JSON.stringify(bodyTexts);

    const { language_learning, language_speaking } = thunkAPI.getState().course;
    const languageCodeLearning = language_learning.language_code;
    const languageCodeSpeaking = language_speaking.language_code;

    const params = `?from=${languageCodeLearning}&to=${languageCodeSpeaking}&api-version=3.0`;
    const url = `https://api.cognitive.microsofttranslator.com/translate${params}`;

    try {
      const response = await axios.post(url, body, config);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const reshapeGoogleApisResponse =
  (response, text) => async (dispatch, getState) => {
    const trans = [];
    if (response.hasOwnProperty("sentences")) {
      response.sentences.forEach((element) => {
        trans.push(element.trans);
      });
    }

    let transDict = [];
    if (response.hasOwnProperty("dict")) {
      transDict = response.dict.map((element) => ({
        pos: element.pos,
        note: "",
        definitions: [],
        meanings: element.entry.map((ele) => {
          const censoredReverses = ele.reverse_translation.filter(
            (el) => el !== text
          );

          return {
            meaning: ele.word.replace(specialCharsRegex, ""),
            reverses:
              censoredReverses.length > 1
                ? [array2Fusion(censoredReverses)]
                : censoredReverses,
          };
        }),
      }));
    }

    return {
      trans,
      transDict,
    };
  };

export const googleApisTranslate = createAsyncThunk(
  "translator/googleApisTranslate",
  async ({ text }, thunkAPI) => {
    const { language_learning, language_speaking } = thunkAPI.getState().course;
    const languageCodeLearning = language_learning.language_code;
    const languageCodeSpeaking = language_speaking.language_code;

    const params = `sl=${languageCodeLearning}&tl=${languageCodeSpeaking}&q=${text}`;
    const extra = "dj=1&dt=t&dt=bd";
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&${params}&${extra}`;

    try {
      const response = await axios.get(url);

      const reshaped = await thunkAPI.dispatch(
        reshapeGoogleApisResponse(response.data, text)
      );

      return thunkAPI.fulfillWithValue(reshaped);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const reshapeEasy4LearnApi =
  (response) => async (dispatch, getState) => {
    const ipa = response.transcription;
    const meaning = response.translation.replace(specialCharsRegex, "");

    const initialTran = (property, objectProperty) => {
      return {
        pos: property,
        note: "",
        definitions: [],
        meanings: objectProperty.map((ele) => ({
          meaning: ele.translation.replace(specialCharsRegex, ""),
          reverses: [
            ele.synonyms.length > 1
              ? array2Fusion(ele.synonyms)
              : ele.synonyms[0],
          ],
        })),
      };
    };

    const trans = [];
    const allPartOfSpeech = response.allPartOfSpeech;
    for (const property in allPartOfSpeech) {
      trans.push(initialTran(property, allPartOfSpeech[property]));
    }

    return {
      ipa,
      meaning,
      trans,
    };
  };

export const easy4LearnApi = createAsyncThunk(
  "translator/easy4LearnApi",
  async ({ text }, thunkAPI) => {
    const { language_learning, language_speaking } = thunkAPI.getState().course;
    const languageCodeLearning = language_learning.language_code;
    const languageCodeSpeaking = language_speaking.language_code;

    const params = `text=${text}&from=${languageCodeLearning}&to=${languageCodeSpeaking}`;
    const url = `https://easy4learn.com/api/vocabulary-translate/word?${params}`;

    try {
      const response = await axios.get(url);
      const reshaped = await thunkAPI.dispatch(
        reshapeEasy4LearnApi(response.data)
      );

      return thunkAPI.fulfillWithValue(reshaped);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isError: false,
  isLoading: false,
  expirationTime: -1,
  microsoftTranslateAuth: null,
  isGoogleApiRateLimit: false,
  isEasy4LearnApiRateLimit: false,
  isArgosopentechApiRateLimit: false,
};

export const translatorSlice = createSlice({
  name: "translator",
  initialState,
  reducers: {
    failSecondTry: (state, action) => {
      state.isError = true;
    },
    resetRateLimit: (state, action) => {
      state.isGoogleApiRateLimit = false;
      state.isEasy4LearnApiRateLimit = false;
      state.isArgosopentechApiRateLimit = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMicrosoftTranslateAuth.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getMicrosoftTranslateAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.microsoftTranslateAuth = action.payload;
        state.expirationTime = Date.now();
      })
      .addCase(getMicrosoftTranslateAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.microsoftTranslateAuth = null;
      })

      .addCase(microsoftTranslator.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(microsoftTranslator.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(microsoftTranslator.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(googleApisTranslate.pending, (state, action) => {
        state.isLoading = true;
        state.isGoogleApiRateLimit = false;
      })
      .addCase(googleApisTranslate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isGoogleApiRateLimit = false;
      })
      .addCase(googleApisTranslate.rejected, (state, action) => {
        state.isLoading = false;
        state.isGoogleApiRateLimit = true;
      })

      .addCase(easy4LearnApi.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
        state.isEasy4LearnApiRateLimit = false;
      })
      .addCase(easy4LearnApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isEasy4LearnApiRateLimit = false;
      })
      .addCase(easy4LearnApi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isEasy4LearnApiRateLimit = true;
      })

      .addCase(argosopentechTranslate.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
        state.isArgosopentechApiRateLimit = false;
      })
      .addCase(argosopentechTranslate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isArgosopentechApiRateLimit = false;
      })
      .addCase(argosopentechTranslate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isArgosopentechApiRateLimit = true;
      });
  },
});

export const { failSecondTry, resetRateLimit } = translatorSlice.actions;

export default translatorSlice.reducer;

/* @fucking_slow */
export const argosopentechTranslate = createAsyncThunk(
  "translator/argosopentechTranslate",
  async ({ text }, thunkAPI) => {
    const { language_learning, language_speaking } = thunkAPI.getState().course;
    const languageCodeLearning = language_learning.language_code;
    const languageCodeSpeaking = language_speaking.language_code;

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const url = `https://translate.argosopentech.com/translate`;
    const body = JSON.stringify({
      q: text,
      source: languageCodeLearning,
      target: languageCodeSpeaking,
      api_key: "",
    });

    try {
      const response = await axios.post(url, body, config);
      console.log("argosopentechTranslate", response.data);
      //  {"translatedText": "Hallo"}
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

/* @deprecated */
export const bingTranslate = createAsyncThunk(
  "translator/bingTranslate",
  async ({ text }, thunkAPI) => {
    const { language_learning, language_speaking } = thunkAPI.getState().course;
    const languageCodeLearning = language_learning.language_code;
    const languageCodeSpeaking = language_speaking.language_code;

    const IG = "65D9C361D86446C6AD945BAED2D4ED38";
    const IID = "translator.5024.1";
    const url = `https://www.bing.com/ttranslatev3?IG=${IG}&IID=${IID}`;
    const body = JSON.stringify({
      q: text,
      source: languageCodeLearning,
      target: languageCodeSpeaking,
      api_key: "",
    });

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    try {
      const response = await axios.post(url, body, config);
      console.log("bingTranslate", response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

/* @depracated
Response body is not available to scripts (Reason: CORS Missing Allow Origin) */
export const googleaClients5Translate = createAsyncThunk(
  "translator/googleaClients5Translate",
  async ({ text }, thunkAPI) => {
    const { language_learning, language_speaking } = thunkAPI.getState().course;
    const languageCodeLearning = language_learning.language_code;
    const languageCodeSpeaking = language_speaking.language_code;

    const params = `sl=${languageCodeLearning}&tl=${languageCodeSpeaking}&q=${text}`;
    const extra = "dj=1&dt=t&dt=bd";
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&${params}&${extra}`;

    try {
      const response = await axios.get(url);
      // ["Guten Morgen"]

      const reshaped = response.data[0].replace(specialCharsRegex, "");
      return thunkAPI.fulfillWithValue(reshaped);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
