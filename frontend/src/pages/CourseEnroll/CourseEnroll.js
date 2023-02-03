import React from "react";
import { BsChevronLeft, BsPerson } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { COURSES_URL, HOST_URL, LEARN_URL } from "../../configs/navigators";
import { enrollCourse } from "../../store/slices/courseSlice";
import { NotFound } from "../NotFound";
import "./CourseEnroll.css";

const CourseEnroll = () => {
  const dispatch = useDispatch();
  const { meow } = useSelector((state) => state.user);
  const { courses, languages } = useSelector((state) => state.course);

  // let courseid = useParams() { params.courseid }
  let { courseid } = useParams();
  courseid = parseInt(courseid);

  const navigate = useNavigate();
  const Navigate2Courses = () => {
    navigate(COURSES_URL);
  };

  const course = courses.find((crs) => crs.id === courseid);
  if (course === undefined) return <NotFound />;

  const onEnrollCourse = () => {
    dispatch(enrollCourse({ course }));
    navigate(LEARN_URL);
  };

  const languageLearning = languages.find(
    (lang) => lang.id === course.language_learning
  );

  return (
    <div className="enroll-section mt-3">
      <div className="meow-card" onClick={() => Navigate2Courses()}>
        <BsChevronLeft size={16} className="me-3" />
        All courses
      </div>
      <div className="position-relative mt-3 d-flex">
        <img
          className="rounded border border-secondary"
          src={HOST_URL + languageLearning.flag}
          width="96"
          height="69"
          alt=""
        />
        <div className="ms-3">
          <h5>{course.name}</h5>
          <div className="d-flex">
            <div>
              {/* {course.num_learners} learners */}
              ? learners
              <BsPerson size={16} className="ms-2 me-4" />
            </div>
            {/* 
            <div>
              {course.num_collections} collections
              <BsJournal size={16} className="ms-2" />
            </div> 
            */}
          </div>
        </div>
        <div className="ms-auto">
          {course.is_learning ? (
            course.id !== meow.course_learning_id && (
              <button
                className="btn btn-secondary"
                onClick={() => onEnrollCourse()}
              >
                Switch to course
              </button>
            )
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => onEnrollCourse()}
            >
              Start course
            </button>
          )}
        </div>
      </div>
      <hr />
      <div>
        <div className="mt-3 mb-5">
          <h5>About the course</h5>
          ----------------------------------
        </div>
        <div>
          <h5>Course contributors</h5>
          ----------------------------------
        </div>
      </div>
    </div>
  );
};

export default CourseEnroll;
