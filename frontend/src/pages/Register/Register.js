import "./Register.css";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HOST_URL } from "../../configs/navigators";
import { LOGIN_URL } from "../../configs/navigators";
import { BsChevronLeft } from "react-icons/bs";
import {
  usernameRegex,
  emailRegex,
  passwordRegex,
} from "../../configs/constants";
import { getCourses } from "../../store/slices/courseSlice";
import {
  register,
  resetMessage,
  setIsInForm,
  setCourseRegister,
  setUsername,
  setEmail,
  setPassword,
  setRepassword,
  resetRegister,
} from "../../store/slices/registerSlice";
import { Slide, Snackbar } from "@mui/material";
import { Alert } from "../../components/Alert";

const Course = ({ course, onCourse }) => {
  const { languages } = useSelector((state) => state.course);

  const languageLearning = languages.find(
    (lang) => lang.id === course.language_learning
  );
  const languageSpeaking = languages.find(
    (lang) => lang.id === course.language_speaking
  );

  return (
    <div
      className="meow-card courses-course m-2"
      onClick={() => onCourse(course, languageLearning)}
    >
      <div className="courses-flag mt-3">
        <img
          className="courses-learning-flag rounded border border-secondary"
          src={HOST_URL + languageLearning?.flag}
          width="96"
          height="69"
          alt=""
        />
        <img
          className="courses-speaking-flag rounded border border-secondary"
          src={HOST_URL + languageSpeaking?.flag}
          alt=""
        />
      </div>
      <div className="mt-3">{languageLearning?.language}</div>
      <small>
        <em>for {languageSpeaking?.language} speakers</em>
      </small>
    </div>
  );
};

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, languages } = useSelector((state) => state.course);

  useEffect(() => {
    if (courses === null) dispatch(getCourses());
  }, [courses, dispatch]);

  const courseTitleRef = useRef("");
  const [languageSelecting, setLanguageSelecting] = useState(0);

  const languageHandler = (e) => {
    const language = e.target.value;
    setLanguageSelecting(parseInt(language));
  };

  useEffect(() => {
    if (languageSelecting === 0) {
      courseTitleRef.current.innerText = "DuoDuo Language Courses";
    } else {
      languages.forEach((element) => {
        if (element.language === languageSelecting) {
          courseTitleRef.current.innerText = `Language Courses for ${element.language} Speakers`;
        }
      });
    }
  }, [languageSelecting, languages]);

  const onCourse = (course, languageLearning) => {
    dispatch(
      setCourseRegister({
        id: course.id,
        name: course.name,
        flag: languageLearning?.flag,
      })
    );
    dispatch(setIsInForm());
  };

  const CoursesMatch = () => {
    const coursesMatched = courses.filter(
      (course) => course.language_speaking === languageSelecting
    );

    return coursesMatched.length > 0 ? (
      coursesMatched.map(
        (course) =>
          course.language_speaking === languageSelecting && (
            <Course key={course.id} course={course} onCourse={onCourse} />
          )
      )
    ) : (
      <div
        className="meow-card text-center mt-3"
        onClick={() => setLanguageSelecting(0)}
      >
        No course available
      </div>
    );
  };

  return (
    <>
      <div className="courses-select mt-3 mb-3">
        <h3 ref={courseTitleRef} className="text-center">
          DuoDuo Language Courses
        </h3>
        <div className="d-flex form-control form-control-lg">
          <select
            className="form-select dark-select"
            onChange={(e) => languageHandler(e)}
            value={languageSelecting}
          >
            <option className="meow-card" value={0}>
              All languages
            </option>
            {languages.map((language) => (
              <option
                className="meow-card"
                key={language.id}
                value={language.id}
              >
                {language.language}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="courses-container row">
        {languageSelecting === 0 ? (
          courses?.map((course) => (
            <Course key={course.id} course={course} onCourse={onCourse} />
          ))
        ) : (
          <CoursesMatch />
        )}
      </div>
    </>
  );
};

const RegisterForm = () => {
  const dispatch = useDispatch();
  const {
    courseId,
    courseName,
    // courseFlag,
    username,
    email,
    password,
    repassword,
  } = useSelector((state) => state.register);

  const onChangeUsername = (e) => {
    dispatch(setUsername(e.target.value));
  };

  const onChangeEmail = (e) => {
    dispatch(setEmail(e.target.value));
  };
  const onChangePassword = (e) => {
    dispatch(setPassword(e.target.value));
  };
  const onChangeRepassword = (e) => {
    dispatch(setRepassword(e.target.value));
  };

  const isUsernameValid = usernameRegex.test(username);
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = passwordRegex.test(password);
  const isRepasswordValid = repassword === password;
  const isInfoValid =
    isUsernameValid && isEmailValid && isPasswordValid && isRepasswordValid;

  const onRegister = () => {
    dispatch(register({ username, email, password, courseid: courseId }));
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      if (isInfoValid) onRegister();
    }
  };

  return (
    <div className="register-section">
      <div className="meow-card" onClick={() => dispatch(setIsInForm())}>
        <BsChevronLeft size={16} className="me-2" />
        Change Course
      </div>
      <h5 className="text-muted mt-2">{courseName}</h5>
      <div autoComplete="off" className="mt-3">
        <div className="form-group">
          <label
            htmlFor="username"
            className={isUsernameValid === false ? "text-danger" : ""}
          >
            Username
            <span className="text-danger ms-1">*</span>
          </label>
          <div className="">
            <input
              id="username"
              className="form-control"
              type="text"
              maxLength="69"
              autoFocus={true}
              name="username"
              value={username}
              required
              onChange={(e) => onChangeUsername(e)}
              onKeyDown={(e) => onEnter(e)}
            />
            <small id="hint_username" className="form-text text-muted">
              Username must contain at least 3 characters. Letters, digits and .
              _ only. Cannot begin or end with a period and cannot have more
              than one period in a row.
            </small>
          </div>
        </div>
        <div className="form-group mt-3">
          <label
            htmlFor="email"
            className={isEmailValid === false ? "text-danger" : ""}
          >
            Email <span className="text-danger ms-1">*</span>
          </label>
          <div className="">
            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              value={email}
              required=""
              maxLength="220"
              onChange={(e) => onChangeEmail(e)}
              onKeyDown={(e) => onEnter(e)}
            />
          </div>
        </div>
        <div className="form-group mt-3">
          <label
            htmlFor="password"
            className={isPasswordValid === false ? "text-danger" : ""}
          >
            Password <span className="text-danger ms-1">*</span>
          </label>
          <div className="">
            <input
              type="password"
              className="form-control"
              required=""
              id="password"
              name="password"
              value={password}
              minLength="8"
              maxLength="72"
              onChange={(e) => onChangePassword(e)}
              onKeyDown={(e) => onEnter(e)}
            />
            <small className="form-text text-muted mt-2">
              Password must contain at least 8 characters including a uppercase
              letter, a lowercase letter, a special character and a number.
            </small>
          </div>
        </div>
        <div className="form-group mt-3 mb-2">
          <label
            htmlFor="repassword"
            className={isRepasswordValid === false ? "text-danger" : ""}
          >
            Password confirmation
          </label>
          <div className="">
            <input
              type="password"
              className="form-control"
              required=""
              id="repassword"
              name="repassword"
              value={repassword}
              minLength="8"
              maxLength="72"
              onChange={(e) => onChangeRepassword(e)}
              onKeyDown={(e) => onEnter(e)}
            />
            <small className="form-text text-muted">
              Enter the same password as before, for verification.
            </small>
          </div>
        </div>
        <button
          className="btn btn-secondary mt-3 register-btn"
          disabled={!isInfoValid}
          onClick={() => onRegister()}
        >
          Register
        </button>
      </div>
      <small>
        Already have an Account?
        <Link className="ms-2" to="/login">
          Login
        </Link>
      </small>
    </div>
  );
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isInForm, message, isError, isRegistered } = useSelector(
    (state) => state.register
  );

  useEffect(() => {
    dispatch(resetRegister());
  }, [dispatch]);

  useEffect(() => {
    if (isRegistered) navigate(LOGIN_URL);
  }, [isRegistered, navigate]);

  const TransitionDown = (props) => {
    return <Slide {...props} direction="down" />;
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={message}
        onClose={() => dispatch(resetMessage())}
        TransitionComponent={TransitionDown}
        // autoHideDuration={6000}
      >
        <Alert message={message} severity={isError ? "danger" : "success"} />
      </Snackbar>

      {isInForm ? <RegisterForm /> : <Courses />}
    </>
  );
};

export default Register;
