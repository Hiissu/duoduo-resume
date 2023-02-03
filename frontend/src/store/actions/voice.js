// import {
//   UPDATE_VOICES_STORE,
//   UPDATE_VOICE_SPEED,
//   UPDATE_USED_STORE,
//   LOAD_VOICES_SUCCESS,
//   UPDATE_VOICE_PITCH,
//   UPDATE_VOICE_VOLUME,
// } from "./types";

// export const onSpeak = (textContent, slow) => async (dispatch, getState) => {
//   const userReducer = getState().user;
//   const voiceSpeed = userReducer.voiceSpeed;
//   const voicePitch = userReducer.voicePitch;
//   const voiceVolume = userReducer.voiceVolume;
//   const voiceIndex = userReducer.voiceIndex;
//   const voicesInLanguageLearning = userReducer.voicesInLanguageLearning;

//   speechSynthesis.cancel();

//   const utterance = new SpeechSynthesisUtterance();
//   utterance.voice = voicesInLanguageLearning[voiceIndex];
//   utterance.lang = utterance.voice.lang;
//   utterance.text = textContent;
//   utterance.pitch = voicePitch;
//   utterance.volume = voiceVolume;
//   utterance.rate = slow ? 0.5 : voiceSpeed;

//   window.speechSynthesis.speak(utterance);
// };

// const getVoiceStore = () => {
//   const voiceStore = JSON.parse(localStorage.getItem("voiceStore"));
//   if (localStorage.voiceStore) {
//     const keys = ["voices", "speed"];
//     if (keys.some((key) => !voiceStore.hasOwnProperty(key))) {
//       localStorage.removeItem("voiceStore");
//       //  set default voiceStore dispatch(saveVoiceStore(true, {}));
//       return { isuccess: false };
//     }

//     if (
//       typeof voiceStore.voices !== "object" ||
//       typeof voiceStore.speed !== "number"
//     ) {
//       return { isuccess: false };
//     }

//     return { isuccess: true, voiceStore: voiceStore };
//   } else {
//     return { isuccess: false };
//   }
// };

// const getUsedStore = () => {
//   const usedStore = JSON.parse(localStorage.getItem("usedStore"));
//   if (localStorage.usedStore) {
//     const keys = ["used"];
//     const used = ["keyboard", "wordbank"];
//     if (keys.some((key) => !usedStore.hasOwnProperty(key))) {
//       localStorage.removeItem("usedStore");
//       return { isuccess: false };
//     }

//     if (typeof usedStore.used !== "string") {
//       return { isuccess: false };
//     }

//     if (!used.some((use) => use === usedStore.used)) {
//       return { isuccess: false };
//     }

//     return { isuccess: true, usedStore: usedStore };
//   } else {
//     return { isuccess: false };
//   }
// };

// export const getVoicesInLanguage = () => async (dispatch, getState) => {
//   const languageLearning = getState().user.languageLearning;
//   const voicesall = speechSynthesis.getVoices();
//   if (voicesall.length === 0) return;

//   const vuris = [];
//   const voices = [];

//   //unfortunately we have to check for duplicates
//   voicesall.forEach((element) => {
//     const uri = element.voiceURI;
//     if (!vuris.includes(uri)) {
//       vuris.push(uri);
//       voices.push(element);
//     }
//   });

//   const voicesInLanguageLearning = voices.filter(
//     (voice) => voice.lang.indexOf(languageLearning.language_code + "-") > -1
//   );

//   let voiceIndex = 0;
//   let voiceSpeed = 1;
//   let voicePitch = 1;
//   let voiceVolume = 1;
//   let voicesInStore = [];
//   let used = "keyboard";

//   const response = getVoiceStore();
//   if (response.isuccess) {
//     const voiceStore = response.voiceStore;
//     if (!!voiceStore.voices) voicesInStore = voiceStore.voices;
//     if (!!voiceStore.speed) voiceSpeed = voiceStore.speed;
//     if (!!voiceStore.pitch) voicePitch = voiceStore.pitch;
//     if (!!voiceStore.volume) voiceVolume = voiceStore.volume;

//     const usedResponse = getUsedStore();
//     if (usedResponse.isuccess) {
//       used = usedResponse.usedStore.used;
//     }

//     const voiceElement = voicesInStore.find(
//       (voice) => voice.language_code === languageLearning.language_code
//     );

//     if (voiceElement !== undefined) {
//       if (!!voiceElement.index) voiceIndex = voiceElement.index;
//     }

//     // if (!!voiceEle.name) {
//     //   const indexLearning = voicesInLanguageLearning.findIndex(
//     //     (voice) => voice.name === voiceEle.name
//     //   );
//     //   if (indexLearning > -1) voiceIndex = indexLearning;
//     // }
//   }

//   const payload = {
//     used,
//     voiceIndex,
//     voiceSpeed,
//     voicePitch,
//     voiceVolume,
//     voicesInLanguageLearning,
//   };

//   dispatch({ type: LOAD_VOICES_SUCCESS, payload });
// };

// export const updateVoicesStore = (voice) => async (dispatch) => {
//   let voices = [];
//   let voiceSpeed = 1;
//   let voicePitch = 1;
//   let voiceVolume = 1;

//   const response = getVoiceStore();
//   if (response.isuccess) {
//     const voiceStore = response.voiceStore;

//     if (!!voiceStore.speed) voiceSpeed = voiceStore.speed;
//     if (!!voiceStore.pitch) voicePitch = voiceStore.pitch;
//     if (!!voiceStore.volume) voiceVolume = voiceStore.volume;

//     if (!!voiceStore.voices) {
//       const voicesInStore = voiceStore.voices;

//       const indexStore = voicesInStore.findIndex(
//         (element) => element.language_code === voice.language_code
//       );

//       if (indexStore > -1) {
//         const newVoices = voicesInStore.map((ele, index) =>
//           index === indexStore ? voice : ele
//         );
//         voices = newVoices;
//       } else voices = [...voicesInStore, voice];
//     }
//   } else voices = [voice];

//   localStorage.setItem(
//     "voiceStore",
//     JSON.stringify({
//       voices,
//       speed: voiceSpeed,
//       pitch: voicePitch,
//       volume: voiceVolume,
//     })
//   );

//   dispatch({ type: UPDATE_VOICES_STORE, payload: voice.index });
// };

// export const updateVoiceSpeed = (speed) => async (dispatch) => {
//   let voices = [];
//   let voicePitch = 1;
//   let voiceVolume = 1;

//   const response = getVoiceStore();
//   if (response.isuccess) {
//     const voiceStore = response.voiceStore;
//     const voicesInStore = voiceStore.voices;
//     voices = voicesInStore;

//     if (!!voiceStore.pitch) voicePitch = voiceStore.pitch;
//     if (!!voiceStore.volume) voiceVolume = voiceStore.volume;
//   }

//   localStorage.setItem(
//     "voiceStore",
//     JSON.stringify({ voices, speed, pitch: voicePitch, volume: voiceVolume })
//   );
//   dispatch({ type: UPDATE_VOICE_SPEED, payload: speed });
// };

// export const updateVoicePitch = (pitch) => async (dispatch) => {
//   let voices = [];
//   let voiceSpeed = 1;
//   let voiceVolume = 1;

//   const response = getVoiceStore();
//   if (response.isuccess) {
//     const voiceStore = response.voiceStore;
//     const voicesInStore = voiceStore.voices;
//     voices = voicesInStore;

//     if (!!voiceStore.speed) voiceSpeed = voiceStore.speed;
//     if (!!voiceStore.volume) voiceVolume = voiceStore.volume;
//   }

//   localStorage.setItem(
//     "voiceStore",
//     JSON.stringify({ voices, pitch, speed: voiceSpeed, volume: voiceVolume })
//   );
//   dispatch({ type: UPDATE_VOICE_PITCH, payload: pitch });
// };

// export const updateVoiceVolume = (volume) => async (dispatch) => {
//   let voices = [];
//   let voiceSpeed = 1;
//   let voicePitch = 1;

//   const response = getVoiceStore();
//   if (response.isuccess) {
//     const voiceStore = response.voiceStore;
//     const voicesInStore = voiceStore.voices;
//     voices = voicesInStore;

//     if (!!voiceStore.speed) voiceSpeed = voiceStore.speed;
//     if (!!voiceStore.pitch) voicePitch = voiceStore.pitch;
//   }

//   localStorage.setItem(
//     "voiceStore",
//     JSON.stringify({ voices, volume, speed: voiceSpeed, pitch: voicePitch })
//   );
//   dispatch({ type: UPDATE_VOICE_VOLUME, payload: volume });
// };

// export const updateUsedStore = (used) => async (dispatch) => {
//   localStorage.setItem("usedStore", JSON.stringify({ used }));
//   dispatch({ type: UPDATE_USED_STORE, payload: used });
// };
