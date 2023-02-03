import "./EmailChangeModal.css";
import React, { useState, useEffect } from "react";
import { BsDash, BsX } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "../../components/Modal";
import { emailRegex } from "../../configs/constants";
import {
  confirmChangeEmail,
  justChangeEmail,
  resetInitial,
} from "../../store/slices/verifySlice";
import { Slide, Snackbar } from "@mui/material";
import { Alert } from "../Alert";

const EmailChangeModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { meow } = useSelector((state) => state.user);
  const { isLoading, isError, message } = useSelector((state) => state.verify);

  useEffect(() => {
    dispatch(resetInitial());
  }, [dispatch]);

  const [verifyCode, setVerifyCode] = useState("");
  const onChangeVerifyCode = (e) => {
    setVerifyCode(e.target.value);
  };

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const onChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(emailRegex.test(value) && value.length > 0);
  };

  const [password, setPassword] = useState("");
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const isCodeInvalid = message === "Invalid verification code";
  const isPasswordIncorrect = message === "Incorrect password";
  const isOtherMessage = message && !isCodeInvalid && !isPasswordIncorrect;

  const onGoingChange = () => {
    if (meow.email_verified) {
      dispatch(
        confirmChangeEmail({ verification_code: verifyCode, email, password })
      );
    } else {
      dispatch(justChangeEmail({ email, password }));
    }
  };

  const [isCanChangeEmail, setIsCanChangeEmail] = useState(false);
  useEffect(() => {
    if (meow.email_verified) {
      setIsCanChangeEmail(
        verifyCode.length >= 6 && isEmailValid && password.length >= 6
      );
    } else {
      setIsCanChangeEmail(isEmailValid && password.length >= 6);
    }
  }, [isEmailValid, meow.email_verified, password, verifyCode.length]);

  useEffect(() => {
    if (isError !== null) {
      if (!isError) onClose();
    }
  }, [isError, onClose]);

  console.log("EmailChangeModal message", message);

  const TransitionDown = (props) => {
    return <Slide {...props} direction="down" />;
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isOtherMessage}
        onClose={() => dispatch(resetInitial())}
        TransitionComponent={TransitionDown}
        // autoHideDuration={6000}
      >
        <Alert message={message} severity={isError ? "danger" : "success"} />
      </Snackbar>

      <Modal isBlackBackDrop={false} onClose={onClose}>
        <div className="ecm">
          <div className="ecm-container">
            <div className="moodal-header">
              <div className="moodal-closer" onClick={() => onClose()}>
                <BsX size={"32px"} />
              </div>
            </div>
            {meow.email_verified && (
              <>
                <div className="moodal-title">Enter code</div>
                <span className="ecm-subtitle text-mute">
                  Check your email: we sent you a verification code. Enter it
                  here to verify you're really you.
                </span>
                <div className="ecm-content">
                  <div className="form-group">
                    <label className="label-cap" htmlFor="verify_code">
                      Verification Code
                      {isCodeInvalid && (
                        <>
                          <BsDash className="ms-2 me-2" />
                          <i className="text-danger">Invalid code</i>
                        </>
                      )}
                    </label>
                    <input
                      id="verify_code"
                      type="text"
                      className="form-control dark-input mt-2"
                      value={verifyCode}
                      onChange={(e) => onChangeVerifyCode(e)}
                    />
                  </div>
                </div>
                <div className="hr" />
              </>
            )}

            <div className="moodal-title">Enter an email address</div>
            <span className="ecm-subtitle text-mute">
              Enter a new email address and your existing password.
            </span>
            <div className="ecm-content">
              <div className="form-group">
                <label className="label-cap" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  className="form-control dark-input mt-2"
                  value={email}
                  autoFocus={true}
                  onChange={(e) => onChangeEmail(e)}
                />
              </div>
              <div className="form-group mt-2">
                <label className="label-cap" htmlFor="password">
                  Current Password
                  {isPasswordIncorrect && (
                    <>
                      <BsDash className="ms-2 me-2" />
                      <i className="text-danger">Incorrect password</i>
                    </>
                  )}
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control dark-input mt-2"
                  value={password}
                  onChange={(e) => onChangePassword(e)}
                />
              </div>
            </div>
          </div>
          <div className="ecm-footer">
            <div className="col btn me-3" onClick={() => onClose()}>
              Cancel
            </div>
            <button
              className="col btn btn-secondary"
              disabled={!isCanChangeEmail}
              onClick={() => onGoingChange()}
            >
              {isLoading ? "Changing..." : "Change"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmailChangeModal;
