import "./Navbar.css";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  AVATAR_URL,
  COLLECTIONS_URL,
  COURSES_URL,
  HOME_URL,
  HOST_URL,
  LOGIN_URL,
  PHRASES_LEARNED_URL,
  PROFILE_URL,
  REGISTER_URL,
  SENTENCES_LEARNED_URL,
  WORDS_LEARNED_URL,
} from "../../configs/navigators";

import { RiStarSmileLine } from "react-icons/ri";
import { Navbar, styled, Text } from "@nextui-org/react";
import { DarkMenu } from "../Menu";
import { Divider, MenuItem } from "@mui/material";
import { GiLotusFlower } from "react-icons/gi";
import {
  DragHandleRounded,
  LogoutRounded,
  // LightMode,
  // NightsStayRounded,
} from "@mui/icons-material";
import { logout } from "../../store/slices/authSlice";
import { enrollCourse, setid2Learning } from "../../store/slices/courseSlice";
import {
  getVoicesInLanguage,
  getSpeechSynthesisVoices,
} from "../../store/slices/settingSlice";
import { MeowaImage, MeowhuhImage } from "./images";

const Layout = styled("div", {
  boxSizing: "border-box",
});

const NavbarDuo = () => {
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  const onEnrollCourse = (course) => {
    dispatch(enrollCourse({ course }));
  };

  const { meow } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { courses, course_learning, courses_learning, language_learning } =
    useSelector((state) => state.course);
  const { speechSynthesisVoices } = useSelector((state) => state.setting);

  useEffect(() => {
    dispatch(getSpeechSynthesisVoices());

    if (!meow !== null && courses !== null) dispatch(setid2Learning());
  }, [dispatch, meow, courses]);

  useEffect(() => {
    if (speechSynthesisVoices !== null && courses !== null);
    dispatch(getVoicesInLanguage());
  }, [dispatch, courses, speechSynthesisVoices]);

  const collapseItems = [
    { url: COURSES_URL, text: "Courses" },
    { url: COLLECTIONS_URL, text: "Collections" },
    { url: "/stories/", text: "Stories" },
    { url: WORDS_LEARNED_URL, text: "Words" },
    { url: PHRASES_LEARNED_URL, text: "Phrases" },
    { url: SENTENCES_LEARNED_URL, text: "Sentences" },
  ];

  const [anchorElCollapse, setAnchorElCollapse] = useState(null);
  const openCollapse = Boolean(anchorElCollapse);
  const handleClickCollapse = (event) => {
    setAnchorElCollapse(event.currentTarget);
  };
  const handleCloseCollapse = () => {
    setAnchorElCollapse(null);
  };

  const [anchorElCourse, setAnchorElCourse] = useState(null);
  const openCourse = Boolean(anchorElCourse);
  const handleClickCourse = (event) => {
    setAnchorElCourse(event.currentTarget);
  };
  const handleCloseCourse = () => {
    setAnchorElCourse(null);
  };

  const [anchorElUser, setAnchorElUser] = useState(null);
  const openUser = Boolean(anchorElUser);
  const handleClickUser = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUser = () => {
    setAnchorElUser(null);
  };

  const [isAvatar, setIsAvatar] = useState(true);
  if (
    isAuthenticated &&
    meow === null
    // Object.keys(language_learning).length < 1 ||
    // Object.keys(course_learning).length < 1
  )
    return <></>;

  return (
    <>
      <DarkMenu
        anchorEl={anchorElCollapse}
        open={openCollapse}
        handleClose={handleCloseCollapse}
      >
        <Text b color="inherit" showIn="xs">
          <MenuItem>
            <div className="nav-collapse-item nav-collapse-home">
              <Link className="navbar-link" to={HOME_URL}>
                <RiStarSmileLine size={32} className="me-2" />
                DuoDuo
              </Link>
            </div>
          </MenuItem>
        </Text>
        {collapseItems.map((item, index) => (
          <MenuItem key={index}>
            <Link className="navbar-link nav-collapse-item" to={item.url}>
              {item.text}
            </Link>
          </MenuItem>
        ))}
      </DarkMenu>

      <DarkMenu
        anchorEl={anchorElCourse}
        open={openCourse}
        handleClose={handleCloseCourse}
      >
        <MenuItem>
          <Text
            b
            color="inherit"
            className="nav-collapse-course nav-course-text text-muted"
          >
            {course_learning.name}
          </Text>
        </MenuItem>
        {courses_learning.length > 0 && <Divider />}
        {courses_learning.map((course) => (
          <MenuItem key={course.id}>
            <div className="nav-collapse-course-wrapper nav-collapse-course">
              <div
                className="nav-course-flag"
                onClick={() => onEnrollCourse(course)}
              >
                <img
                  alt=""
                  className="rounded nav-course-flag-ll"
                  src={HOST_URL + course.language_learning.flag}
                />
                <img
                  alt=""
                  className="rounded nav-course-flag-ls"
                  src={HOST_URL + course.language_speaking.flag}
                />
              </div>
              <div className="nav-collapse-course-name">
                <span>{course.name.split(" for ")[0]}</span>
                <small>
                  <i>for {course.name.split(" for ")[1]}</i>
                </small>
              </div>
            </div>
          </MenuItem>
        ))}
        <MenuItem>
          <Divider className="nav-collapse-course" />
        </MenuItem>
        <MenuItem>
          <Link
            to={COURSES_URL}
            className="nav-collapse-course nav-link nav-course-text"
          >
            Start a new course?
          </Link>
        </MenuItem>
      </DarkMenu>

      {isAuthenticated && (
        <DarkMenu
          anchorEl={anchorElUser}
          open={openUser}
          handleClose={handleCloseUser}
        >
          <MenuItem>
            <Link
              className="navbar-link nav-collapse-option"
              to={PROFILE_URL(meow.username)}
            >
              Profile
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              className="navbar-link nav-collapse-option"
              to="/settings-account/"
            >
              Account
            </Link>
          </MenuItem>
          <Divider />
          <MenuItem>
            <div
              className="nav-collapse-option nav-logout"
              onClick={() => onLogout()}
            >
              <Text color="inherit">Log Out</Text>
              <LogoutRounded className="me-2" sx={{ fontSize: 26 }} />
            </div>
          </MenuItem>
        </DarkMenu>
      )}

      <Layout
        css={{
          maxW: "100%",
        }}
      >
        <Navbar
          isBordered
          variant="sticky"
          containerCss={{
            backgroundColor: "#222429 !important",
            color: "white",
          }}
        >
          <Navbar.Brand>
            {isAuthenticated && (
              <Navbar.Content showIn="md" onClick={handleClickCollapse}>
                <DragHandleRounded className="pointer" sx={{ fontSize: 32 }} />
              </Navbar.Content>
            )}
            <Navbar.Content hideIn="xs">
              <Link className="navbar-link" to={HOME_URL}>
                <RiStarSmileLine size={32} className="me-2" />
                <Text b color="inherit">
                  DuoDuo
                </Text>
              </Link>
            </Navbar.Content>
            {/* <Navbar.Content hideIn="xs">
              <Link className="navbar-link" to={HOME_URL}>
                <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                  {theme.palette.mode === "dark" ? (
                    <NightsStayRounded size={22} />
                  ) : (
                    <LightMode size={22} />
                  )}
                </IconButton>
              </Link>
            </Navbar.Content> */}
          </Navbar.Brand>

          {isAuthenticated && (
            <>
              <Navbar.Content
                enableCursorHighlight
                activeColor="secondary"
                variant="highlight-rounded"
                hideIn="sm"
              >
                <Link className="navbar-link" to={COURSES_URL}>
                  Courses
                </Link>
              </Navbar.Content>
              <Navbar.Content
                enableCursorHighlight
                activeColor="primary"
                variant="highlight-rounded"
                hideIn="sm"
              >
                <Link className="navbar-link" to={COLLECTIONS_URL}>
                  Collections
                </Link>
              </Navbar.Content>
              <Navbar.Content
                enableCursorHighlight
                activeColor="primary"
                variant="highlight-rounded"
                hideIn="sm"
              >
                <Link className="navbar-link" to="/stories/">
                  Stories
                </Link>
              </Navbar.Content>
              <Navbar.Content
                enableCursorHighlight
                activeColor="primary"
                variant="highlight-rounded"
                hideIn="md"
              >
                <Link className="navbar-link" to={WORDS_LEARNED_URL}>
                  Words
                </Link>
              </Navbar.Content>
              <Navbar.Content
                enableCursorHighlight
                activeColor="primary"
                variant="highlight-rounded"
                hideIn="md"
              >
                <Link className="navbar-link" to={PHRASES_LEARNED_URL}>
                  Phrases
                </Link>
              </Navbar.Content>
              <Navbar.Content
                enableCursorHighlight
                activeColor="primary"
                variant="highlight-rounded"
                hideIn="md"
              >
                <Link className="navbar-link" to={SENTENCES_LEARNED_URL}>
                  Sentences
                </Link>
              </Navbar.Content>
            </>
          )}

          {isAuthenticated ? (
            <Navbar.Content>
              <div className="nav-flag" onClick={handleClickCourse}>
                <img
                  alt=""
                  className="rounded nav-flag-ll"
                  src={HOST_URL + language_learning.flag}
                />
              </div>
              <div className="nav-daystreak ms-2 me-2">
                <GiLotusFlower size={32} />
                <span className="fw-bold ms-2">{meow.day_streak}</span>
              </div>
              <div className="nav-user" onClick={handleClickUser}>
                <img
                  className="nav-item rounded-circle me-2"
                  style={{ height: "42px", width: "42px" }}
                  src={isAvatar ? AVATAR_URL + meow.avatar : MeowhuhImage}
                  alt=""
                  onError={() => setIsAvatar(false)}
                />
                <Text b color="inherit" hideIn="sm">
                  {meow.username}
                </Text>
              </div>
            </Navbar.Content>
          ) : (
            <Navbar.Content>
              <Link className="navbar-link" to={LOGIN_URL}>
                Login
              </Link>
              <Link className="navbar-link" to={REGISTER_URL}>
                Sign Up
              </Link>
            </Navbar.Content>
          )}
        </Navbar>
      </Layout>
    </>
  );
};

export default NavbarDuo;
