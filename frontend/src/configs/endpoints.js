export const HOST_URL = "http://localhost:8000/";
export const ROOT_URL = "http://localhost:8000/api";

// Auth URLS
export const CSRF_COOKIE_URL = `${ROOT_URL}/csrfcookie/`;
export const AUTHENTICATED_URL = `${ROOT_URL}/authenticated/`;
export const REGISTER_URL = `${ROOT_URL}/register/`;
export const LOGIN_URL = `${ROOT_URL}/login/`;
export const LOGOUT_URL = `${ROOT_URL}/logout/`;

// Settings & Verify URLS
export const EMAIL_VERIFICATIONS_URL = `${ROOT_URL}/email_verifications/`;
export const EMAIL_VERIFICATIONS_VERIFY_URL = `${ROOT_URL}/email_verifications/verify/`;

export const EMAIL_CHANGE_URL = `${ROOT_URL}/email_change/`;
export const EMAIL_CHANGE_VERIFY_URL = `${ROOT_URL}/email_change/verify/`;

export const PASSWORD_RESET_URL = `${ROOT_URL}/password_reset/`;
export const PASSWORD_RESET_VERIFY_URL = `${ROOT_URL}/password_reset/verify/`;

export const PROFILE_UPDATE_URL = `${ROOT_URL}/profiles/update/`;
export const PASSWORD_UPDATE_URL = `${ROOT_URL}/password/update/`;

export const USERNAME_EXIST_URL = `${ROOT_URL}/username_exist/`;
export const USERNAME_CHANGE_URL = `${ROOT_URL}/username_change/`;

// User URLS
export const MEOW_URL = `${ROOT_URL}/meow/`;

export const PROFILE_DETAIL_URL = (username) => {
  return `${ROOT_URL}/profiles/${username}/`;
};

// Home URLS
export const HOME_URL = `${ROOT_URL}/`;
export const LEARN_URL = `${ROOT_URL}/learn/`;

// Nav URLS
export const WORDS_LEARNED_URL = `${ROOT_URL}/words/learned/`;
export const PHRASES_LEARNED_URL = `${ROOT_URL}/phrases/learned/`;
export const SENTENCES_LEARNED_URL = `${ROOT_URL}/sentences/learned/`;
export const COLLECTIONS_LEARNING_URL = `${ROOT_URL}/collections/learning/`;

// Course URLS
export const LANGUAGES_URL = `${ROOT_URL}/languages/`;
export const COURSES_URL = `${ROOT_URL}/courses/`;

export const COURSES_DETAIL_URL = (courseId) => {
  return `${ROOT_URL}/courses/${courseId}/detail/`;
};
export const COURSES_BY_LANGUAGE_CODE_URL = (languageCode) => {
  return `${ROOT_URL}/courses/${languageCode}/`;
};
export const COURSES_ENROLL_URL = (courseId) => {
  return `${ROOT_URL}/courses/${courseId}/enroll/`;
};
export const COURSES_REMOVE_URL = (courseId) => {
  return `${ROOT_URL}/courses/${courseId}/remove/`;
};

// Category URLS
export const CATEGORIES_URL = `${ROOT_URL}/categories/`;

// Collection URLS
export const COLLECTIONS_CREATE_URL = `${ROOT_URL}/collections/create/`;

export const COLLECTIONS_URL = (params) => {
  return `${ROOT_URL}/collections/${params}`;
};

export const COLLECTIONS_SEARCH_URL = (params) => {
  return `${ROOT_URL}/collections/search${params}`;
};

export const COLLECTIONS_DETAIL_URL = (collectionId) => {
  return `${ROOT_URL}/collections/${collectionId}/detail/`;
};

export const COLLECTIONS_REVIEW_URL = (collectionId) => {
  return `${ROOT_URL}/collections/${collectionId}/review/`;
};

export const COLLECTIONS_LEARN_URL = (collectionId) => {
  return `${ROOT_URL}/collections/${collectionId}/learn/`;
};
export const COLLECTIONS_DELETE_URL = (collectionId) => {
  return `${ROOT_URL}/collections/${collectionId}/delete/`;
};
export const COLLECTIONS_REMOVE_URL = (collectionId) => {
  return `${ROOT_URL}/collections/${collectionId}/remove/`;
};

// Unit URLS
export const UNITS_MANAGE_URL = (unitId) => {
  return `${ROOT_URL}/units/${unitId}/manage/`;
};

// Dictionary URLS
export const WORDS_URL = (languageCode) => {
  return `${ROOT_URL}/words/${languageCode}/`;
};
export const PHRASES_URL = (languageCode) => {
  return `${ROOT_URL}/phrases/${languageCode}/`;
};
export const SENTENCES_URL = (languageCode) => {
  return `${ROOT_URL}/sentences/${languageCode}/`;
};

// Word translations URLS
export const WORD_TRANSLATIONS_GET_URL = (wordId, paramsUrl = "") => {
  return `${ROOT_URL}/words/${wordId}/translations/`;
  // return `${ROOT_URL}/words/${wordId}/translations/search` + paramsUrl;
};

export const WORD_TRANSLATIONS_CREATE_URL = (wordId) => {
  return `${ROOT_URL}/words/${wordId}/translations/create/`;
};

export const WORD_TRANSLATIONS_UPDATE_URL = (translationId) => {
  return `${ROOT_URL}/words/translations/${translationId}/update/`;
};

export const WORD_TRANSLATIONS_DELETE_URL = (translationId) => {
  return `${ROOT_URL}/words/translations/${translationId}/delete/`;
};

export const WORD_TRANSLATIONS_USE_URL = (translationId) => {
  return `${ROOT_URL}/words/translations/${translationId}/use/`;
};

export const WORD_TRANSLATIONS_REMOVE_URL = (translationId) => {
  return `${ROOT_URL}/words/translations/${translationId}/remove/`;
};
