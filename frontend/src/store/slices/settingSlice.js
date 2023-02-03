import { createSlice } from "@reduxjs/toolkit";
import { isHasKeys, isObject } from "../../configs/functions";

export const getSettingsStore = (voicesLength) => {
  // voices: [{ index: _, language_code: _}]
  const initialSetting = {
    voices: [],
    rate: 1,
    pitch: 1,
    volume: 1,
    answerType: "keyboard",
  };

  try {
    const settingsStore = JSON.parse(localStorage.getItem("settingsStore"));
    if (!settingsStore) return initialSetting;
    else if (!isObject(settingsStore)) return initialSetting;

    if (settingsStore.hasOwnProperty("voices")) {
      if (isObject(settingsStore.voices)) {
        const voiceKeys = ["index", "language_code"];

        settingsStore.voices.forEach((element) => {
          if (isHasKeys(element, voiceKeys)) {
            if (
              typeof element.index === "number" ||
              typeof element.language_code === "string"
            ) {
              if (element.index >= 0 && element.index <= voicesLength - 1) {
                initialSetting.voices.push(element);
              }
            }
          }
        });
      }
    }

    if (settingsStore.hasOwnProperty("rate")) {
      if (typeof settingsStore.rate === "number") {
        if (settingsStore.rate >= 0 && settingsStore.rate <= 10)
          initialSetting.rate = settingsStore.rate;
      }
    }

    if (settingsStore.hasOwnProperty("pitch")) {
      if (typeof settingsStore.pitch === "number") {
        if (settingsStore.pitch >= 0 && settingsStore.pitch <= 2)
          initialSetting.pitch = settingsStore.pitch;
      }
    }

    if (settingsStore.hasOwnProperty("volume")) {
      if (typeof settingsStore.volume === "number") {
        if (settingsStore.volume >= 0 && settingsStore.volume <= 1)
          initialSetting.volume = settingsStore.volume;
      }
    }

    const answerTypes = ["keyboard", "wordbank"];
    if (settingsStore.hasOwnProperty("answerType")) {
      if (typeof settingsStore.answerType === "string") {
        if (answerTypes.includes(settingsStore.answerType))
          initialSetting.answerType = settingsStore.answerType;
      }
    }

    return initialSetting;
  } catch (error) {
    return initialSetting;
  }
};

export const onSpeak =
  (text, isSlow, isRandomVoice) => async (dispatch, getState) => {
    const speechSynthesis = window.speechSynthesis;

    speechSynthesis.cancel();
    const { voicesInLearning, voiceIndex, voicePitch, voiceVolume, voiceRate } =
      getState().setting;

    const min = 0;
    const max = voicesInLearning.length - 1;
    const randomIndex = Math.floor(Math.random() * (max - min + 1) + min);
    const randomVoiceIndex = isRandomVoice ? randomIndex : voiceIndex;

    const voiceUtterance = voicesInLearning[randomVoiceIndex];

    const utterance = new SpeechSynthesisUtterance();
    utterance.voice = voiceUtterance;
    utterance.lang = voiceUtterance.lang;
    utterance.text = text;
    utterance.pitch = voicePitch;
    utterance.volume = voiceVolume;
    utterance.rate = isSlow ? 0.5 : voiceRate;

    speechSynthesis.speak(utterance);
  };

export const onSpeechSynthesisVoices = () => async (dispatch, getState) => {
  const speech = window.speechSynthesis;
  if (speech.onvoiceschanged !== undefined) {
    speech.onvoiceschanged = () => {
      dispatch(setSpeechSynthesisVoices(speechSynthesis.getVoices()));
      // dispatch(setSpeechSynthesisVoices(speech.getVoices()));
    };
  }
};

export const getSpeechSynthesisVoices = () => async (dispatch, getState) => {
  dispatch(setSpeechSynthesisVoices(speechSynthesis.getVoices()));
  // dispatch(setSpeechSynthesisVoices(window.speechSynthesis.getVoices()));
};

export const getVoicesInLanguage = () => async (dispatch, getState) => {
  const { speechSynthesisVoices } = getState().setting;

  // const speechSynthesisVoices = window.speechSynthesis.getVoices();
  // if (speechSynthesisVoices.length === 0) return;

  /* @redundant - check for duplicates
  const voices = [];
  const vuris = [];
  speechSynthesisVoices.forEach((element) => {
    const element = { 
      default: true, lang: "en-US", localService: true, 
      name: "Microsoft David - English (United States)",
      voiceURI: "Microsoft David - English (United States)",
    };

    const uri = element.voiceURI;
    if (!vuris.includes(uri)) {
      vuris.push(uri);
      voices.push(element);
    }
  }); */

  const { language_learning } = getState().course;
  const voicesInLearning = speechSynthesisVoices.filter(
    (voice) => voice.lang.indexOf(language_learning.language_code + "-") > -1
  );

  const voicesLength = voicesInLearning.length;
  const initialSetting = getSettingsStore(voicesLength);

  let voiceIndex = 0;
  const found = initialSetting.voices.find(
    (voice) => voice.language_code === language_learning.language_code
  );
  if (found) voiceIndex = found.index;

  const payload = {
    voices: voicesInLearning,
    index: voiceIndex,
    rate: initialSetting.rate,
    pitch: initialSetting.pitch,
    volume: initialSetting.volume,
    answerType: initialSetting.answerType,
  };

  dispatch(setInitialState(payload));
};

export const updateVoiceIndex = (voice) => async (dispatch, getState) => {
  // const voice = { index: value, language_code: _};

  const { voicesInLearning } = getState().setting;
  const initialSetting = getSettingsStore(voicesInLearning.length);

  let voices;
  const voicesInStore = initialSetting.voices;

  const indexFound = voicesInStore.findIndex(
    (ele) => ele.language_code === voice.language_code
  );

  if (indexFound > -1) {
    const newVoices = voicesInStore.map((ele, index) =>
      index === indexFound ? voice : ele
    );
    voices = newVoices;
  } else voices = [...voicesInStore, voice];

  localStorage.setItem(
    "settingsStore",
    JSON.stringify({ ...initialSetting, voices })
  );

  dispatch(setVoiceIndex(voice.index));
};

export const updateVoiceRate = (rate) => async (dispatch, getState) => {
  const { voicesInLearning } = getState().setting;
  const initialSetting = getSettingsStore(voicesInLearning.length);

  localStorage.setItem(
    "settingsStore",
    JSON.stringify({ ...initialSetting, rate })
  );

  dispatch(setVoiceRate(rate));
};

export const updateVoicePitch = (pitch) => async (dispatch, getState) => {
  const { voicesInLearning } = getState().setting;
  const initialSetting = getSettingsStore(voicesInLearning.length);

  localStorage.setItem(
    "settingsStore",
    JSON.stringify({ ...initialSetting, pitch })
  );

  dispatch(setVoicePitch(pitch));
};

export const updateVoiceVolume = (volume) => async (dispatch, getState) => {
  const { voicesInLearning } = getState().setting;
  const initialSetting = getSettingsStore(voicesInLearning.length);

  localStorage.setItem(
    "settingsStore",
    JSON.stringify({ ...initialSetting, volume })
  );

  dispatch(setVoiceVolume(volume));
};

export const updateAnswerType = (answerType) => async (dispatch, getState) => {
  const { voicesInLearning } = getState().setting;
  const initialSetting = getSettingsStore(voicesInLearning.length);

  localStorage.setItem(
    "settingsStore",
    JSON.stringify({ ...initialSetting, answerType })
  );

  dispatch(setAnswerType(answerType));
};

const initialState = {
  voiceIndex: 0,
  voiceRate: 1,
  voicePitch: 1,
  voiceVolume: 1,
  voicesInLearning: [],
  answerType: "keyboard",
  speechSynthesisVoices: null,
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setSpeechSynthesisVoices: (state, action) => {
      state.speechSynthesisVoices = action.payload;
    },
    setInitialState: (state, action) => {
      const payload = action.payload;
      state.voiceIndex = payload.index;
      state.voiceRate = payload.rate;
      state.voicePitch = payload.pitch;
      state.voiceVolume = payload.volume;
      state.voicesInLearning = payload.voices;
      state.answerType = payload.answerType;
    },
    setVoiceIndex: (state, action) => {
      state.voiceIndex = action.payload;
    },
    setVoiceRate: (state, action) => {
      state.voiceRate = action.payload;
    },
    setVoicePitch: (state, action) => {
      state.voicePitch = action.payload;
    },
    setVoiceVolume: (state, action) => {
      state.voiceVolume = action.payload;
    },
    setAnswerType: (state, action) => {
      state.answerType = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setSpeechSynthesisVoices,
  setInitialState,
  setVoiceIndex,
  setVoiceRate,
  setVoicePitch,
  setVoiceVolume,
  setAnswerType,
} = settingSlice.actions;

export default settingSlice.reducer;
