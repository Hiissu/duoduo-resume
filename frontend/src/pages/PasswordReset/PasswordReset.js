import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { emailRegex } from "../../configs/constants";
import { LOGIN_URL } from "../../configs/navigators";
import { resetPassword } from "../../store/actions/user";
import "./PasswordReset.css";

const PasswordReset = ({ resetPassword }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const onChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(emailRegex.test(value) && value.length > 0);
  };

  const onReset = () => {
    (async () => {
      const response = await resetPassword(email);

      if (response.isuccess) setIsReset(true);
      else alert(response.message);
    })();
  };

  const onEnter = (e) => {
    if (e.key === "Enter") if (isEmailValid) onReset();
  };

  return (
    <div className="pr-container">
      <h1 className="pr-header">Reset your password</h1>
      <div className="pr-body mt-3">
        {!isReset ? (
          <>
            <label htmlFor="email_field">
              Enter your user account's verified email address and we will send
              you a password reset link.
            </label>
            <input
              type="text"
              name="email"
              id="email_field"
              className="form-control dark-input mt-3 mb-3"
              autoFocus={true}
              placeholder="Enter your email address"
              value={email}
              autoComplete="nope"
              onChange={(e) => onChangeEmail(e)}
              onKeyDown={(e) => onEnter(e)}
            />

            {/* <h2 className="f4 mb-3">Verify your account</h2> */}
            <button
              className="btn btn-secondary w-100"
              disabled={!isEmailValid}
              onClick={() => onReset()}
            >
              Send password reset email
            </button>
          </>
        ) : (
          <>
            <p className="mt-0 mb-3">
              Check your email for a link to reset your password. If it doesn't
              appear within a few minutes, check your spam folder.
            </p>
            <p>
              Account recovery email sent to anhmetlamroi01@gmail.com If you
              don't see this email in your inbox within 15 minutes, look for it
              in your junk mail folder. If you find it there, please mark it as
              “Not Junk”.
            </p>
            <Link
              className="btn btn-secondary w-100"
              to={LOGIN_URL}
              // data-hydro-click-hmac="47f1bb5301d30897e22730660062c9fdf365d1403c01e28a855c9f48f970c76c"
            >
              Return to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
