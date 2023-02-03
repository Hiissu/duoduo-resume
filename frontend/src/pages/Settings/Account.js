import React, { useState, useEffect } from "react";
import { BsExclamationCircle, BsX } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { Divider } from "@mui/material";

import {
  UsernameChangeModal,
  EmailSentModal,
  EmailRequestChangeModal,
} from "./components";
import {
  EmailChangeModal,
  EmailVerifyModal,
} from "../../components/Verifications";
import { resetInitial, verifyEmail } from "../../store/slices/verifySlice";

const Account = ({ setSettingWhat }) => {
  const dispatch = useDispatch();
  const { meow } = useSelector((state) => state.user);
  const { isError } = useSelector((state) => state.verify);

  useEffect(() => {
    dispatch(resetInitial());
  }, [dispatch]);

  const [isChangingUsername, setIsChangingUsername] = useState(false);

  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isRequestingChangeEmail, setIsRequestingChangeEmail] = useState(false);

  const onRequestChangeEmail = () => {
    setIsChangingEmail(true);
    setIsRequestingChangeEmail(false);
  };

  const onChangeEmail = () => {
    if (meow?.email_verified) {
      setIsRequestingChangeEmail(true);
    } else {
      setIsChangingEmail(true);
    }
  };

  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const onReverifyEmail = () => {
    dispatch(verifyEmail(meow?.email));

    // will call ?????????????
    if (!isError) setIsVerifyEmail(true);
  };

  const onVerifyEmail = () => {
    setIsVerifyEmail(true);
  };

  return (
    <>
      {isVerifyEmail && (
        <EmailVerifyModal onClose={() => setIsVerifyEmail(false)} />
      )}

      {isChangingUsername && (
        <UsernameChangeModal onClose={() => setIsChangingUsername(false)} />
      )}

      {isRequestingChangeEmail && (
        <EmailRequestChangeModal
          onClose={() => setIsRequestingChangeEmail(false)}
          onRequestChange={onRequestChangeEmail}
        />
      )}
      {isChangingEmail && (
        <EmailChangeModal onClose={() => setIsChangingEmail(false)} />
      )}

      <div className="st-account-section">
        <div className="st-account-wrapper">
          <div className="st-account">
            <h1 className="mb-3">My Account</h1>
            <div className="d-flex flex-row">
              <img
                className="st-avatar"
                src={meow?.avatar}
                alt={meow?.username}
              />
              <h5>{meow?.username}</h5>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setSettingWhat("profile")}
            >
              Edit profile
            </button>
            <div className="mt-3">
              <label className="label-cap" htmlFor="username">
                Username
              </label>
              <div className="d-flex flex-row justify-content-between">
                <span className="">{meow?.username}</span>
                <button
                  className="btn btn-outltine-secondary"
                  onClick={() => setIsChangingUsername(true)}
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="">
              <label className="label-cap" htmlFor="email">
                Email
              </label>
              <div className="d-flex flex-row justify-content-between">
                <span className="">{meow?.email}</span>
                <button
                  className="btn btn-outltine-secondary"
                  onClick={() => onChangeEmail()}
                >
                  Edit
                </button>
              </div>
            </div>
            {!meow?.email_verified && (
              <div className="d-flex mt-3">
                <div className="">
                  <BsExclamationCircle
                    size={22}
                    className="text-warning me-3"
                  />
                  <h5 className="text-uppercase">Unverified Email</h5>
                </div>
                <button
                  className="btn btn-secondary mt-3"
                  onClick={() => onVerifyEmail()}
                >
                  Verify Email
                </button>
                <button
                  className="btn btn-secondary mt-3"
                  onClick={() => onReverifyEmail()}
                >
                  Resend Verification Email
                </button>
              </div>
            )}
          </div>
          <Divider />
          <div className="st-password">
            <h1 className="mb-3">Password and Authentication</h1>
            <button type="button" className="btn btn-primary mb-3">
              Change Password
            </button>
            <h5 className="text-uppercase text-muted mb-1">
              Two-factor authentication
            </h5>
            <div className="st-authentication text-muted mb-2">
              Protect your DuoDuo account with an extra layer of security. Once
              configured, you'll be required to enter both your password and an
              authentication code from your email in order to sign in.
            </div>
            <button type="button" className="btn btn-primary">
              Enable Two-Factor Auth
            </button>
          </div>
          <Divider />
          <div className="st-removal">
            <h5 className="text-uppercase text-muted mb-1">Account Removal</h5>
            <div className="st-authentication text-muted mb-2">
              Disabling your account means you can recover it at any time after
              taking this action.
            </div>
            <button type="button" className="btn btn-danger">
              Delete Account
            </button>
          </div>
        </div>
        <div className="st-close">
          <div className="d-flex flex-column align-items-center">
            <div className="st-close-btn">
              <BsX size={18} />
            </div>
            <div className="st-esc">ESC</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
