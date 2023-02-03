import "./EmailVerifyModal.css";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "../Modal";
import { BsX } from "react-icons/bs";
import {
  confirmEmail,
  resetInitial,
  verifyEmail,
} from "../../store/slices/verifySlice";
import EmailChangeModal from "./EmailChangeModal";
import { CircularProgress } from "@mui/material";

const EmailVerifyModal = ({ onClose }) => {
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

  const onVerify = () => {
    dispatch(confirmEmail(meow?.email, verifyCode));
  };

  const [isChangingEmail, setIsChangingEmail] = useState(false);

  console.log("EmailVerifyModal isError", isError);

  useEffect(() => {
    if (isError !== null) {
      if (!isError) onClose();
    }
  }, [isError, onClose]);

  const onCloseChanging = () => {
    setIsChangingEmail(false);
    onClose();
  };

  const onReverifyEmail = () => {
    dispatch(verifyEmail(meow?.email));
  };

  const isCanVerify = verifyCode.trim().length > 0;

  if (isChangingEmail)
    return <EmailChangeModal onClose={() => onCloseChanging()} />;

  return (
    <>
      <Modal isBlackBackDrop={false} onClose={onClose}>
        <div className="evm">
          <div className="evm-container">
            <div className="moodal-header">
              <div className="moodal-closer" onClick={() => onClose()}>
                <BsX size={"32px"} />
              </div>
              <div className="moodal-title">Verify email</div>
            </div>
            <div className="evm-content">
              <div className="evm-subtitle">
                We sent a verification code to <strong>{meow?.email}</strong>.
              </div>
              <div className="evm-subtitle">
                Enter it here to verify you're really you.
              </div>
              <div className="form-group">
                <label htmlFor="verify-code" className="label-cap">
                  Verification Code
                </label>
                <input
                  type="text"
                  className="form-control dark-input mt-2"
                  id="verify-code"
                  autoComplete="nope"
                  value={verifyCode}
                  autoFocus={true}
                  onChange={onChangeVerifyCode}
                />
              </div>
              <small className={`${isError ? "text-danger" : "text-green"}`}>
                {message}
              </small>
              <div className="form-group mt-3">
                Didn't receive a code or it expired?
                <span
                  className="evm-resend ms-2 me-2"
                  onClick={() => onReverifyEmail()}
                >
                  Resend Verification Code
                </span>
                {isLoading && <CircularProgress size={24} />}
              </div>
              <div className="form-group mt-2">
                Update new email address?
                <span
                  className="evm-resend ms-2"
                  onClick={() => setIsChangingEmail(true)}
                >
                  Change email address
                </span>
              </div>
            </div>
          </div>
          <div className="evm-footer form-group">
            <div className="col btn me-3" onClick={() => onClose()}>
              Cancel
            </div>
            <button
              className="col btn btn-secondary"
              disabled={!isCanVerify}
              onClick={() => onVerify()}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmailVerifyModal;
