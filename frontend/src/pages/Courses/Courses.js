import "./Courses.css";
import React, { useEffect, useRef, useState } from "react";
import { BsCheck } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { COURSES_ENROLL_URL, HOST_URL } from "../../configs/navigators";

const Course = ({ course }) => {
  const navigate = useNavigate();
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
      onClick={() => navigate(COURSES_ENROLL_URL(course.id))}
    >
      <div>
        {course.is_learning && (
          <BsCheck size={32} className="courses-learning float-end mt-1" />
        )}
        <div className="courses-flag mt-3">
          <img
            className="courses-learning-flag rounded border border-secondary"
            src={HOST_URL + languageLearning?.flag}
            alt=""
          />
          <img
            className="courses-speaking-flag rounded border border-secondary"
            src={HOST_URL + languageSpeaking?.flag}
            alt=""
          />
        </div>
      </div>
      <div className="mt-4">{languageLearning?.language}</div>
      <small className="">
        <em>for {languageSpeaking?.language} speakers</em>
      </small>
    </div>
  );
};

const Courses = () => {
  const { courses, languages } = useSelector((state) => state.course);

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

  const CoursesMatch = () => {
    const coursesMatched = courses.filter(
      (course) => course.language_speaking === languageSelecting
    );

    return coursesMatched.length > 0 ? (
      coursesMatched.map(
        (course) =>
          course.language_speaking === languageSelecting && (
            <Course key={course.id} course={course} />
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
        <div className="courses-container row">
          {languageSelecting === 0 ? (
            courses?.map((course) => <Course key={course.id} course={course} />)
          ) : (
            <CoursesMatch />
          )}
        </div>
      </div>
    </>
  );
};

export default Courses;
