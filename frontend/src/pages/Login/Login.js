import { Slide, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsDash } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { usernameRegex, passwordRegex } from "../../configs/constants";
import { PASSWORD_RESET_URL } from "../../configs/navigators";
import { login, setIsError } from "../../store/slices/authSlice";
import { resetMessage } from "../../store/slices/registerSlice";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.register);
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setIsError());
  }, [dispatch]);

  // const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const onChangeEmail = (e) => { setEmail(e.target.value); };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  // const isEmailValid = emailRegex.test(email) && email.length > 0;
  const isUsernameInvalid = usernameRegex.test(username) && username.length > 0;
  const isPasswordInvalid = passwordRegex.test(password) && password.length > 0;

  const onEnter = (e) => {
    if (e.key === "Enter") onLogin();
  };

  const [isLoading, setIsLoading] = useState(false);

  const onLogin = () => {
    setIsLoading(true);

    if (isUsernameInvalid && isPasswordInvalid) {
      dispatch(login({ username, password }));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);

        if (!isUsernameInvalid || !isPasswordInvalid) {
          dispatch(setIsError(true));
        }
      }
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, isLoading, isUsernameInvalid, isPasswordInvalid]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isError) dispatch(setIsError(false));
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, isError, dispatch]);

  // const passwordRef = useRef(null);
  // const [revealPassword, setRevealPassword] = useState(false);
  // const onReveal = () => {
  //   const passwordLength = password.length;
  //   passwordRef.current.setSelectionRange(passwordLength, passwordLength);
  //   passwordRef.current.focus();
  // };

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
        <Alert message={message} severity={"success"} />
      </Snackbar>

      <div className="login-section">
        <div className="header-bar text-center">
          <h1>Login</h1>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label
              htmlFor="username"
              // className={!isUsernameInvalid ? "text-danger" : ""}
            >
              Username <span className="text-danger ms-1">*</span>
              {isError && (
                <>
                  <BsDash className="ms-2 me-2" />
                  <i className="text-danger">Incorrect</i>
                </>
              )}
            </label>
            <input
              tabIndex="0"
              type="text"
              autoFocus={true}
              autoCapitalize="none"
              autoComplete="off"
              className="form-control dark-input mt-2"
              required={true}
              id="username"
              value={username}
              onKeyDown={(e) => onEnter(e)}
              onChange={(e) => onChangeUsername(e)}
            />
          </div>
          <div className="form-group mt-2">
            <label
              htmlFor="password"
              // className={!isPasswordInvalid ? "text-danger" : ""}
            >
              Password <span className="text-danger ms-1">*</span>
              {isError && (
                <>
                  <BsDash className="ms-2 me-2" />
                  <i className="text-danger">Incorrect</i>
                </>
              )}
            </label>
            <div className="login-passeye">
              <input
                tabIndex="0"
                // ref={passwordRef}
                // type={revealPassword ? "text" : "password"}
                type="password"
                id="password"
                className="form-control dark-input login-password mt-2"
                autoComplete="nope"
                spellCheck="false"
                required={true}
                value={password}
                onKeyDown={(e) => onEnter(e)}
                onChange={(e) => onChangePassword(e)}
              />
              {/* <span
                className="login-eye"
                onClick={() => {
                  onReveal();
                  setRevealPassword(!revealPassword);
                }}
              >
                {revealPassword ? (
                  <BsEyeSlash size={22} />
                ) : (
                  <BsEye size={22} />
                )}
              </span> */}
            </div>
          </div>
          <small tabIndex="-1">
            <Link
              className="text-mute float-end ms-2 mt-1"
              to={PASSWORD_RESET_URL}
            >
              Forgot password?
            </Link>
          </small>
          <hr />
          <button
            tabIndex="0"
            className="btn btn-secondary mt-3 login-btn"
            onClick={() => onLogin()}
            // disabled={!(isUsernameInvalid === true && isPasswordInvalid === true)}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
