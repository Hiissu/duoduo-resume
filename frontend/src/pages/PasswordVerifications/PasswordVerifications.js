import React, { useEffect, useRef, useState } from "react";
import { BsDash, BsEye, BsEyeSlash } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { passwordRegex } from "../../configs/constants";
import { LOGIN_URL } from "../../configs/navigators";
import { confirmResetPassword } from "../../store/actions/user";
import "./PasswordVerifications.css";

const PasswordVerifications = ({ confirmResetPassword }) => {
  const dispatch = useDispatch();

  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const revealPasswordRef = useRef(null);
  const [revealPassword, setRevealPassword] = useState(false);

  useEffect(() => {
    const length = revealPassword.length;
    revealPasswordRef.current.setSelectionRange(length, length);
    revealPasswordRef.current.focus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealPassword]);

  const revealConfirmationRef = useRef(null);
  const [revealConfirmation, setRevealConfirmation] = useState(false);

  useEffect(() => {
    const length = revealConfirmation.length;
    revealConfirmationRef.current.setSelectionRange(length, length);
    revealConfirmationRef.current.focus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealConfirmation]);

  const onChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const onChangePasswordConfirmation = (e) => {
    const value = e.target.value;
    setPasswordConfirmation(value);
  };

  const [messageResponse, setMessageResponse] = useState(null);

  const navigate = useNavigate();
  const onResetChangePassword = () => {
    (async () => {
      console.log(token);
      const response = await confirmResetPassword(token, password);

      if (response.isuccess) navigate(LOGIN_URL);
      else setMessageResponse(response.message);
    })();
  };

  const generatePassword = () => {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let passwordLength = 12;
    let randomPassword = "";

    for (let i = 0; i <= passwordLength; i++) {
      let randomNumber = Math.floor(Math.random() * chars.length);
      randomPassword += chars.substring(randomNumber, randomNumber + 1);
    }

    navigator.clipboard.writeText(randomPassword);
  };

  const isPasswordValid = passwordRegex.test(password) && password.length > 0;
  const canChange = passwordConfirmation === password && isPasswordValid;

  const onEnter = (e) => {
    if (e.key === "Enter") if (canChange) onResetChangePassword();
  };

  return (
    <>
      <div className="pv-container">
        <div className="pv-header">
          <h1>Change your password</h1>
        </div>
        <div className="pv-body">
          <div className="">
            <label
              className={`label-cap mb-2 ${
                isPasswordValid ? "" : "text-danger"
              }`}
              htmlFor="password"
            >
              Password
              {messageResponse && (
                <>
                  <BsDash className="ms-2 me-2" />
                  <i className="text-danger">{messageResponse}</i>
                </>
              )}
            </label>
            <div className="pv-passeye">
              <input
                type={revealPassword ? "text" : "password"}
                ref={revealPasswordRef}
                name="password"
                id="password"
                className="form-control dark-input pv-password"
                autoFocus={true}
                autoComplete="nope"
                spellCheck="false"
                value={password}
                onChange={(e) => onChangePassword(e)}
                onCopy={() => generatePassword()}
              />
              <span
                className="pv-eye"
                onClick={() => setRevealPassword(!revealPassword)}
              >
                {revealPassword ? (
                  <BsEyeSlash size={22} />
                ) : (
                  <BsEye size={22} />
                )}
              </span>
            </div>
          </div>
          <div className="mt-3 mb-3">
            <label
              className={`label-cap mb-2 ${
                passwordConfirmation === password ? "" : "text-danger"
              }`}
              htmlFor="password_confirmation"
            >
              Confirm password
            </label>
            <div className="pv-passeye">
              <input
                type={revealConfirmation ? "text" : "password"}
                ref={revealConfirmationRef}
                name="password_confirmation"
                id="password_confirmation"
                className="form-control dark-input pv-password"
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(e) => onChangePasswordConfirmation(e)}
                onKeyDown={(e) => onEnter(e)}
              />
              <span
                className="pv-eye"
                onClick={() => setRevealConfirmation(!revealConfirmation)}
              >
                {revealConfirmation ? (
                  <BsEyeSlash size={22} />
                ) : (
                  <BsEye size={22} />
                )}
              </span>
            </div>
            <span className="form-text text-muted mt-2">
              Password must contain at least 8 characters including a uppercase
              letter, a lowercase letter, a special character and a number.
            </span>
          </div>
          <button
            className="btn btn-secondary w-100"
            disabled={!canChange}
            onClick={() => onResetChangePassword()}
          >
            Change password
          </button>
        </div>
      </div>
    </>
  );
};

export default PasswordVerifications;
