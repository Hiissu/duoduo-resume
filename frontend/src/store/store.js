import { configureStore } from "@reduxjs/toolkit";
import {
  authReducer,
  registerReducer,
  userReducer,
  courseReducer,
  categoryReducer,
  wordReducer,
  phraseReducer,
  sentenceReducer,
  collectionReducer,
  unitReducer,
  unitManagementReducer,
  settingReducer,
  verifyReducer,
  translatorReducer,
} from "./slices";

const rootReducer = {
  auth: authReducer,
  register: registerReducer,
  user: userReducer,
  course: courseReducer,
  category: categoryReducer,
  word: wordReducer,
  phrase: phraseReducer,
  sentence: sentenceReducer,
  collection: collectionReducer,
  unit: unitReducer,
  unitManagement: unitManagementReducer,
  setting: settingReducer,
  verify: verifyReducer,
  translator: translatorReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
