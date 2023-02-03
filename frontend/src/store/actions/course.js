import axios from "axios";
import Cookies from "js-cookie";
import {
  LOAD_LEARNING_SUCCESS,
  LOAD_COURSES_SUCCESS,
  LOAD_COURSES_FAIL,
  LOAD_LANGUAGES_SUCCESS,
  ENROLL_COURSE_SUCCESS,
  REMOVE_COURSE_SUCCESS,
} from "./types";
import {
  COURSES_URL,
  COURSES_ENROLL_URL,
  COURSES_REMOVE_URL,
} from "../../configs/endpoints";
import { checkAuthenticated } from "./auth";
// import { saveLanguages2Reducer } from "./language";/

export const loadCourses = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  try {
    const response = await axios.get(COURSES_URL, config);
    const responseData = response.data;

    dispatch(convert2Learning(responseData.courses, responseData.languages));

    dispatch({ type: LOAD_LANGUAGES_SUCCESS, payload: responseData.languages });
    dispatch({ type: LOAD_COURSES_SUCCESS, payload: responseData.courses });

    return { isuccess: true, courses: responseData.courses };
  } catch (error) {
    console.log(error);
    if (error.response) dispatch(checkAuthenticated(error.response.status));
    dispatch({ type: LOAD_COURSES_FAIL });
    return { isuccess: false, message: error };
  }
};

const ids2CoursesLearning = (meow, courses, languages) => {
  const courses_learning = [];
  courses.forEach((course) => {
    if (
      meow.courses_learning_ids.some(
        (id) => id === course.id && id !== meow.course_learning_id
      )
    )
      courses_learning.push({
        ...course,
        language_learning: languages.find(
          (lang) => lang.id === course.language_learning
        ),
        language_speaking: languages.find(
          (lang) => lang.id === course.language_speaking
        ),
      });
  });

  return courses_learning;
};

const id2CourseLearning = (meow, courses, languages) => {
  const course_learning = courses.find(
    (course) => course.id === meow.course_learning_id
  );

  const language_learning = languages.find(
    (lang) => lang.id === course_learning.language_learning
  );

  const language_speaking = languages.find(
    (lang) => lang.id === course_learning.language_speaking
  );

  return {
    courseLearning: course_learning,
    languageLearning: language_learning,
    languageSpeaking: language_speaking,
  };
};

export const convert2Learning =
  (courses, languages) => async (dispatch, getState) => {
    const meow = getState().user.meow;
    const response = id2CourseLearning(meow, courses, languages);
    const coursesLearning = ids2CoursesLearning(meow, courses, languages);

    dispatch({
      type: LOAD_LEARNING_SUCCESS,
      payload: { ...response, coursesLearning: coursesLearning },
    });
  };

export const getCourses = () => async (dispatch, getState) => {
  const courses = getState().course.courses;
  const languages = getState().language.languages;

  if (courses === null) dispatch(loadCourses());
  else dispatch(convert2Learning(courses, languages));
};

export const enrollCourse = (course) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  const body = JSON.stringify({});

  try {
    const response = await axios.post(
      COURSES_ENROLL_URL(course.id),
      body,
      config
    );
    if (response.data.isuccess)
      dispatch({ type: ENROLL_COURSE_SUCCESS, payload: course });

    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response) dispatch(checkAuthenticated(error.response.status));
    return { isuccess: false, message: error };
  }
};

export const removeCourse = (course) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
    withCredentials: true,
  };
  const body = JSON.stringify({});

  try {
    const response = await axios.post(
      COURSES_REMOVE_URL(course.id),
      body,
      config
    );
    if (response.data.isuccess)
      dispatch({ type: REMOVE_COURSE_SUCCESS, payload: course });

    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response) dispatch(checkAuthenticated(error.response.status));
    return { isuccess: false, message: error };
  }
};
