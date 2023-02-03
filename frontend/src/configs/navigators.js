export const HOST_URL = "http://localhost:8000";
export const AVATAR_URL = "http://localhost:8000/images/";

// Auth URLS
export const REGISTER_URL = `/register/`;
export const LOGIN_URL = `/login/`;
export const LOGOUT_URL = `/logout/`;

// Verify URLS
export const PASSWORD_RESET_URL = `/password_reset/`;

// Settings URLS
export const SETTINGS_ACCOUNT_URL = `/settings/account/`;

// Home URLS
export const HOME_URL = `/`;
export const LEARN_URL = `/learn/`;

// Nav URLS
export const ABOUT_URL = `/about/`;
export const FEATURES_URL = `/features/`;

export const WORDS_LEARNED_URL = `/words/learned/`;
export const PHRASES_LEARNED_URL = `/phrases/learned/`;
export const SENTENCES_LEARNED_URL = `/sentences/learned/`;
export const COLLECTIONS_LEARNING_URL = `/collections/learning/`;

// User URLS
export const PROFILE_URL = (username) => {
  return `/profiles/${username}`;
};

// Course URLS
export const LANGUAGES_URL = `/languages/`;
export const COURSES_URL = `/courses/`;

export const COURSES_DETAIL_URL = (courseId) => {
  return `/courses/${courseId}/detail/`;
};
export const COURSES_BY_LANGUAGE_CODE_URL = (languageCode) => {
  return `/courses/${languageCode}/`;
};
export const COURSES_ENROLL_URL = (courseId) => {
  return `/courses/${courseId}/enroll/`;
};
export const COURSES_REMOVE_URL = (courseId) => {
  return `/courses/${courseId}/remove/`;
};

// Topic URLS
export const TOPICS_URL = `/topics/`;

// Collection URLS
export const COLLECTIONS_URL = `/collections/`;
export const COLLECTIONS_CREATE_URL = `/collections/create/`;
export const COLLECTIONS_SEARCH_URL = `/collections/search`;

export const COLLECTIONS_DETAIL_URL = (collectionId) => {
  return `/collections/${collectionId}/detail/`;
};
export const WORDS_IN_COURSE_URL = (collectionId) => {
  return `/collections/${collectionId}/words-in-course/`;
};
export const PHRASES_IN_COURSE_URL = (collectionId) => {
  return `/collections/${collectionId}/phrases-in-course/`;
};
export const SENTENCES_IN_COURSE_URL = (collectionId) => {
  return `/collections/${collectionId}/sentences-in-course/`;
};

export const COLLECTIONS_LEARN_URL = (collectionId) => {
  return `/collections/${collectionId}/learn/`;
};
export const COLLECTIONS_DELETE_URL = (collectionId) => {
  return `/collections/${collectionId}/delete/`;
};
export const COLLECTIONS_REMOVE_URL = (collectionId) => {
  return `/collections/${collectionId}/remove/`;
};
