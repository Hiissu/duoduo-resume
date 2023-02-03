import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { resetAuth } from "./authSlice";
import { changeCourseLearning } from "./userSlice";
import {
  COURSES_URL,
  COURSES_ENROLL_URL,
  COURSES_REMOVE_URL,
} from "../../configs/endpoints";

const id2Learning = (meow, courses, languages) => {
  const course_learning = meow
    ? courses.find((course) => course.id === meow.course_learning_id)
    : -1;

  const language_learning = meow
    ? languages.find((lang) => lang.id === course_learning.language_learning)
    : -1;

  const language_speaking = meow
    ? languages.find((lang) => lang.id === course_learning.language_speaking)
    : -1;

  const courses_learning = [];
  courses.forEach((course) => {
    if (
      meow &&
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

  return {
    course_learning,
    courses_learning,
    language_learning,
    language_speaking,
  };
};

export const setid2Learning = () => async (dispatch, getState) => {
  const { meow } = getState().user;
  const { courses, languages } = getState().course;

  const s2Learning = id2Learning(meow, courses, languages);
  dispatch(setLearning(s2Learning));
};

export const getCourses = createAsyncThunk(
  "course/getCourses",
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
      const response = await axios.get(COURSES_URL, config);
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const enrollCourse = createAsyncThunk(
  "course/enrollCourse",
  async ({ course }, thunkAPI) => {
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

      thunkAPI.dispatch(changeCourseLearning(course));
      thunkAPI.dispatch(setid2Learning());

      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeCourse = createAsyncThunk(
  "course/removeCourse",
  async ({ course }, thunkAPI) => {
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

      const meow = thunkAPI.getState().user.meow;
      if (course.id === meow.course_learning) {
        const { courses_learning: coursesLearning } =
          thunkAPI.getState().course;

        const coursesLeft = coursesLearning.filter(
          (element) => element.id !== course.id
        );
        thunkAPI.dispatch(changeCourseLearning(coursesLeft[0]));
      }

      thunkAPI.dispatch(setid2Learning());

      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  courses: null,
  languages: [],
  course_learning: {},
  courses_learning: [],
  language_learning: {},
  language_speaking: {},
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setLearning: (state, action) => {
      const payload = action.payload;
      state.course_learning = payload.course_learning;
      state.courses_learning = payload.courses_learning;
      state.language_learning = payload.language_learning;
      state.language_speaking = payload.language_speaking;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCourses.pending, (state, action) => {})
      .addCase(getCourses.fulfilled, (state, action) => {
        state.courses = action.payload.courses;
        state.languages = action.payload.languages;
      })
      .addCase(getCourses.rejected, (state, action) => {})

      .addCase(enrollCourse.pending, (state, action) => {})
      .addCase(enrollCourse.fulfilled, (state, action) => {})
      .addCase(enrollCourse.rejected, (state, action) => {})

      .addCase(removeCourse.pending, (state, action) => {})
      .addCase(removeCourse.fulfilled, (state, action) => {})
      .addCase(removeCourse.rejected, (state, action) => {});
  },
});

export const { setLearning } = courseSlice.actions;

export default courseSlice.reducer;
