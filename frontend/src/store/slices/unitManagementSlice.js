import { createSlice } from "@reduxjs/toolkit";
import {
  validateUnknownPhrases,
  validateUnknownSentences,
  validateUnknownWords,
} from "../../configs/functions";

export const findUnit =
  (collectionId, unitId) => async (dispatch, getState) => {
    const { collections } = getState().collection;
    const found = collections.find(
      (collection) => collection.id === collectionId
    );
    if (found) {
      const unitFound = found.units.find((ele) => ele.id === unitId);
      const payload = {
        ...unitFound,
        unknown_words: validateUnknownWords(unitFound.unknown_words),
        unknown_phrases: validateUnknownPhrases(unitFound.unknown_phrases),
        unknown_sentences: validateUnknownSentences(
          unitFound.unknown_sentences
        ),
      };

      dispatch(setInitial(payload));
    }
  };

const initialState = {
  managing: 0,
  optioning: 0,
  text2Meow: "",
  isShowingMenu: true,
  isCanClose: true,
  useMyTranslation: false,

  numWillAdd: 0,
  numWillRemove: 0,

  wordIdsInUnit: [],
  phraseIdsInUnit: [],
  sentenceIdsInUnit: [],

  wordsInUnit: [],
  phrasesInUnit: [],
  sentencesInUnit: [],

  wordsInDict: [],
  phrasesInDict: [],
  sentencesInDict: [],

  unknownWordsInUnit: [],
  unknownPhrasesInUnit: [],
  unknownSentencesInUnit: [],

  unknownWordsInitial: [],
  unknownPhrasesInitial: [],
  unknownSentencesInitial: [],

  wordsWillAdd: [],
  phrasesWillAdd: [],
  sentencesWillAdd: [],

  wordsWillRemove: [],
  phrasesWillRemove: [],
  sentencesWillRemove: [],

  unknownWordsWillAdd: [],
  unknownPhrasesWillAdd: [],
  unknownSentencesWillAdd: [],

  unknownWordsWillRemove: [],
  unknownPhrasesWillRemove: [],
  unknownSentencesWillRemove: [],
};

export const unitManagementSlice = createSlice({
  name: "unitManagement",
  initialState,
  reducers: {
    setInitial: (state, action) => {
      const payload = action.payload;
      state.wordIdsInUnit = payload.words;
      state.phraseIdsInUnit = payload.phrases;
      state.sentenceIdsInUnit = payload.sentences;

      state.unknownWordsInUnit = payload.unknown_words;
      state.unknownPhrasesInUnit = payload.unknown_phrases;
      state.unknownSentencesInUnit = payload.unknown_sentences;

      state.unknownWordsInitial = payload.unknown_words;
      state.unknownPhrasesInitial = payload.unknown_phrases;
      state.unknownSentencesInitial = payload.unknown_sentences;
    },
    resetInitial: (state, action) => {
      state.managing = 0;
      state.optioning = 0;
      state.text2Meow = "";
      state.isShowingMenu = true;
      state.isCanClose = true;
      state.useMyTranslation = false;

      state.numWillAdd = 0;
      state.numWillRemove = 0;

      state.wordIdsInUnit = [];
      state.phraseIdsInUnit = [];
      state.sentenceIdsInUnit = [];

      state.wordsInUnit = [];
      state.phrasesInUnit = [];
      state.sentencesInUnit = [];

      state.wordsInDict = [];
      state.phrasesInDict = [];
      state.sentencesInDict = [];

      state.unknownWordsInUnit = [];
      state.unknownPhrasesInUnit = [];
      state.unknownSentencesInUnit = [];

      state.unknownWordsInitial = [];
      state.unknownPhrasesInitial = [];
      state.unknownSentencesInitial = [];

      state.wordsWillAdd = [];
      state.phrasesWillAdd = [];
      state.sentencesWillAdd = [];

      state.wordsWillRemove = [];
      state.phrasesWillRemove = [];
      state.sentencesWillRemove = [];

      state.unknownWordsWillAdd = [];
      state.unknownPhrasesWillAdd = [];
      state.unknownSentencesWillAdd = [];

      state.unknownWordsWillRemove = [];
      state.unknownPhrasesWillRemove = [];
      state.unknownSentencesWillRemove = [];
    },
    resetWill: (state, action) => {
      state.isCanClose = true;
      state.numWillAdd = 0;
      state.numWillRemove = 0;

      state.wordsWillAdd = [];
      state.phrasesWillAdd = [];
      state.sentencesWillAdd = [];

      state.wordsWillRemove = [];
      state.phrasesWillRemove = [];
      state.sentencesWillRemove = [];

      state.unknownWordsWillAdd = [];
      state.unknownPhrasesWillAdd = [];
      state.unknownSentencesWillAdd = [];

      state.unknownWordsWillRemove = [];
      state.unknownPhrasesWillRemove = [];
      state.unknownSentencesWillRemove = [];

      state.unknownWordsInUnit = state.unknownWordsInitial;
      state.unknownPhrasesInUnit = state.unknownPhrasesInitial;
      state.unknownSentencesInUnit = state.unknownSentencesInitial;
    },
    setManaging: (state, action) => {
      state.managing = action.payload;
    },
    setOptioning: (state, action) => {
      state.optioning = action.payload;
    },
    setText2Meow: (state, action) => {
      state.text2Meow = action.payload;
    },
    setIsShowingMenu: (state, action) => {
      state.isShowingMenu = !state.isShowingMenu;
    },

    setUseMyTranslation: (state, action) => {
      state.useMyTranslation = !state.useMyTranslation;
    },
    setWordsIn: (state, action) => {
      const payload = action.payload;
      state.wordsInUnit = payload.wordsInUnit;
      state.wordsInDict = payload.wordsInDict;
    },
    afterWill: (state, action) => {
      const numWillAdd =
        state.wordsWillAdd.length +
        state.phrasesWillAdd.length +
        state.sentencesWillAdd.length +
        state.unknownWordsWillAdd.length +
        state.unknownPhrasesWillAdd.length +
        state.unknownSentencesWillAdd.length;

      const numWillRemove =
        state.wordsWillRemove.length +
        state.phrasesWillRemove.length +
        state.sentencesWillRemove.length +
        state.unknownWordsWillRemove.length +
        state.unknownPhrasesWillRemove.length +
        state.unknownSentencesWillRemove.length;

      state.numWillAdd = numWillAdd;
      state.numWillRemove = numWillRemove;

      if (
        numWillAdd > 0 ||
        numWillRemove > 0 ||
        JSON.stringify(state.unknownWordsInUnit) !==
          JSON.stringify(state.unknownWordsInitial) ||
        JSON.stringify(state.unknownPhrasesInUnit) !==
          JSON.stringify(state.unknownPhrasesInitial) ||
        JSON.stringify(state.unknownSentencesInUnit) !==
          JSON.stringify(state.unknownSentencesInitial)
      )
        state.isCanClose = false;
      else state.isCanClose = true;
    },
    addWill: (state, action) => {
      const type = action.payload.type;
      const object = action.payload.object;
      const will =
        action.payload.will; /* true ~ willAdd / false ~ willRemove */

      switch (type) {
        case "word":
          if (will) state.wordsWillAdd.push(object);
          else state.wordsWillRemove.push(object);
          break;

        case "phrase":
          if (will) state.phrasesWillAdd.push(object);
          else state.phrasesWillRemove.push(object);

          break;
        case "sentence":
          if (will) state.sentencesWillAdd.push(object);
          else state.sentencesWillRemove.push(object);

          break;
        case "unknown_word":
          if (will) state.unknownWordsWillAdd.push(object);
          else state.unknownWordsWillRemove.push(object);

          break;
        case "unknown_phrase":
          if (will) state.unknownPhrasesWillAdd.push(object);
          else state.unknownPhrasesWillRemove.push(object);

          break;
        case "unknown_sentence":
          if (will) state.unknownSentencesWillAdd.push(object);
          else state.unknownSentencesWillRemove.push(object);

          break;

        default:
          break;
      }

      unitManagementSlice.caseReducers.afterWill(state, action);
    },
    addAll: (state, action) => {
      const type = action.payload.type;
      const all = action.payload.all;

      switch (type) {
        case "word":
          state.wordsWillAdd = [...state.wordsWillAdd, ...all];
          break;

        case "phrase":
          state.phrasesWillAdd = [...state.phrasesWillAdd, ...all];

          break;
        case "sentence":
          state.sentencesWillAdd = [...state.sentencesWillAdd, ...all];

          break;
        case "unknown_word":
          state.unknownWordsWillAdd = [...state.unknownWordsWillAdd, ...all];

          break;
        case "unknown_phrase":
          state.unknownPhrasesWillAdd = [
            ...state.unknownPhrasesWillAdd,
            ...all,
          ];

          break;
        case "unknown_sentence":
          state.unknownSentencesWillAdd = [
            ...state.unknownSentencesWillAdd,
            ...all,
          ];

          break;

        default:
          break;
      }

      unitManagementSlice.caseReducers.afterWill(state, action);
    },
    removeWill: (state, action) => {
      const type = action.payload.type;
      const object = action.payload.object;
      const will =
        action.payload.will; /* true ~ willAdd / false ~ willRemove */

      switch (type) {
        case "word":
          if (will)
            state.wordsWillAdd = state.wordsWillAdd.filter(
              (ele) => ele.id !== object.id
            );
          else
            state.wordsWillRemove = state.wordsWillRemove.filter(
              (ele) => ele.id !== object.id
            );

          break;
        case "phrase":
          if (will)
            state.phrasesWillAdd = state.phrasesWillAdd.filter(
              (ele) => ele.id !== object.id
            );
          else
            state.phrasesWillRemove = state.phrasesWillRemove.filter(
              (ele) => ele.id !== object.id
            );

          break;
        case "sentence":
          if (will)
            state.sentencesWillAdd = state.sentencesWillAdd.filter(
              (ele) => ele.id !== object.id
            );
          else
            state.sentencesWillRemove = state.sentencesWillRemove.filter(
              (ele) => ele.id !== object.id
            );

          break;
        case "unknown_word":
          if (will)
            state.unknownWordsWillAdd = state.unknownWordsWillAdd.filter(
              (ele) => ele.word !== object.word
            );
          else
            state.unknownWordsWillRemove = state.unknownWordsWillRemove.filter(
              (ele) => ele.word !== object.word
            );

          break;
        case "unknown_phrase":
          if (will)
            state.unknownPhrasesWillAdd = state.unknownPhrasesWillAdd.filter(
              (ele) => ele.phrase !== object.phrase
            );
          else
            state.unknownPhrasesWillRemove =
              state.unknownPhrasesWillRemove.filter(
                (ele) => ele.phrase !== object.phrase
              );

          break;
        case "unknown_sentence":
          if (will)
            state.unknownSentencesWillAdd =
              state.unknownSentencesWillAdd.filter(
                (ele) => ele.sentence !== object.sentence
              );
          else
            state.unknownSentencesWillRemove =
              state.unknownSentencesWillRemove.filter(
                (ele) => ele.sentence !== object.sentence
              );

          break;

        default:
          break;
      }

      unitManagementSlice.caseReducers.afterWill(state, action);
    },
    removeAll: (state, action) => {
      const type = action.payload.type;

      switch (type) {
        case "word":
          state.wordsWillAdd = [];
          break;

        case "phrase":
          state.phrasesWillAdd = [];

          break;
        case "sentence":
          state.sentencesWillAdd = [];

          break;
        case "unknown_word":
          state.unknownWordsWillAdd = [];

          break;
        case "unknown_phrase":
          state.unknownPhrasesWillAdd = [];

          break;
        case "unknown_sentence":
          state.unknownSentencesWillAdd = [];

          break;

        default:
          break;
      }

      unitManagementSlice.caseReducers.afterWill(state, action);
    },
    updateUnknownTranslation: (state, action) => {
      const type = action.payload.type;
      const will = action.payload.will;
      const object = action.payload.object;
      const translation = action.payload.translation;

      switch (type) {
        case "unknown_word":
          if (will)
            state.unknownWordsWillAdd = state.unknownWordsWillAdd.map((ele) =>
              ele.word === object.word ? { ...ele, translation } : ele
            );
          else
            state.unknownWordsInUnit = state.unknownWordsInUnit.map((ele) =>
              ele.word === object.word ? { ...ele, translation } : ele
            );

          break;
        case "unknown_phrase":
          if (will)
            state.unknownPhrasesWillAdd = state.unknownPhrasesWillAdd.map(
              (ele) =>
                ele.phrase === object.phrase ? { ...ele, translation } : ele
            );
          else
            state.unknownPhrasesInUnit = state.unknownPhrasesInUnit.map((ele) =>
              ele.phrase === object.phrase ? { ...ele, translation } : ele
            );

          break;
        case "unknown_sentence":
          if (will)
            state.unknownSentencesWillAdd = state.unknownSentencesWillAdd.map(
              (ele) =>
                ele.sentence === object.sentence ? { ...ele, translation } : ele
            );
          else
            state.unknownSentencesInUnit = state.unknownSentencesInUnit.map(
              (ele) =>
                ele.sentence === object.sentence ? { ...ele, translation } : ele
            );

          break;

        default:
          break;
      }

      unitManagementSlice.caseReducers.afterWill(state, action);
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setInitial,
  resetInitial,
  resetWill,
  setManaging,
  setOptioning,
  setText2Meow,
  setIsShowingMenu,
  setUseMyTranslation,
  setWordsIn,
  addWill,
  addAll,
  removeWill,
  removeAll,
  updateUnknownTranslation,
} = unitManagementSlice.actions;

export default unitManagementSlice.reducer;
