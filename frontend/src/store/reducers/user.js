import {
  ENROLL_COURSE_SUCCESS,
  REMOVE_COURSE_SUCCESS,
  LOAD_MEOW_STORE,
  LOAD_MEOW_SUCCESS,
  LOAD_MEOW_FAIL,
  LOAD_LEARNING_SUCCESS,
  LOAD_VOICES_SUCCESS,
  UPDATE_VOICES_STORE,
  UPDATE_VOICE_SPEED,
  UPDATE_VOICE_PITCH,
  UPDATE_VOICE_VOLUME,
  UPDATE_USED_STORE,
  UPDATE_POINTS_IN_LEARNED,
  VERIFY_EMAIL_SUCCESS,
  CHANGE_USERNAMME_SUCCESS,
  CHANGE_EMAIL_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
  JUST_CHANGE_EMAIL_SUCCESS,
} from "../actions/types";

const initialState = {
  meow: null,
  learned: {},

  courseLearning: {},
  coursesLearning: [],

  languageLearning: {},
  languageSpeaking: {},

  voiceIndex: 0,
  voiceSpeed: 1,
  voicePitch: 1,
  voiceVolume: 1,
  used: "keyboard",
  voicesInLanguageLearning: [],
};

export default function UserReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_VOICES_SUCCESS:
      return {
        ...state,
        used: payload.used,
        voiceIndex: payload.voiceIndex,
        voiceSpeed: payload.voiceSpeed,
        voicePitch: payload.voicePitch,
        voiceVolume: payload.voiceVolume,
        voicesInLanguageLearning: payload.voicesInLanguageLearning,
      };
    case UPDATE_VOICES_STORE:
      return { ...state, voiceIndex: payload };
    case UPDATE_USED_STORE:
      return { ...state, used: payload };
    case UPDATE_VOICE_SPEED:
      return { ...state, voiceSpeed: payload };
    case UPDATE_VOICE_PITCH:
      return { ...state, voicePitch: payload };
    case UPDATE_VOICE_VOLUME:
      return { ...state, voiceVolume: payload };

    case LOAD_MEOW_STORE:
    case LOAD_MEOW_SUCCESS:
      return { ...state, meow: payload };
    case LOAD_LEARNING_SUCCESS:
      return {
        ...state,
        courseLearning: payload.courseLearning,
        coursesLearning: payload.coursesLearning,

        languageLearning: payload.languageLearning,
        languageSpeaking: payload.languageSpeaking,
      };

    case UPDATE_POINTS_IN_LEARNED:
      return {
        ...state,
        learned: state.learned.map((element) =>
          element.language === payload.languageLearning
            ? {
                ...element,
                words: payload.wordRecords,
                phrases: payload.phraseRecords,
                sentences: payload.sentenceRecords,
              }
            : element
        ),
      };

    case ENROLL_COURSE_SUCCESS:
      return {
        ...state,
        meow: {
          ...state.meow,
          course_learning_id: payload.id,
          courses_learning_ids: state.meow.courses_learning_ids.filter(
            (id) => id !== payload.id
          ),
        },
        courseLearning: payload,
        coursesLearning: state.coursesLearning.filter(
          (course) => course.id !== payload.id
        ),
      };
    case REMOVE_COURSE_SUCCESS:
      return {
        ...state,
        coursesLearning: state.coursesLearning.filter(
          (course) => course.id !== payload.id
        ),
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        meow: {
          ...state.meow,
          bio: payload.bio,
          name: payload.name,
          avatar: payload.avatar,
        },
      };
    case VERIFY_EMAIL_SUCCESS:
      return { ...state, meow: { ...state.meow, email_verified: true } };
    case CHANGE_USERNAMME_SUCCESS:
      return { ...state, meow: { ...state.meow, username: payload } };
    case CHANGE_EMAIL_SUCCESS:
      return {
        ...state,
        meow: { ...state.meow, email: payload, email_verified: true },
      };
    case JUST_CHANGE_EMAIL_SUCCESS:
      return {
        ...state,
        meow: { ...state.meow, email: payload, email_verified: false },
      };

    case LOAD_MEOW_FAIL:
      return { ...state, meow: {} };
    default:
      return state;
  }
}
