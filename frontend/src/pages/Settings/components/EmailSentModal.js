import React from "react";
import "./EmailSentModal.css";
import { BsX } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "../../../components/Modal";

const EmailSentModal = ({ onClose, message }) => {
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.user.meow);

  // We sent a verification email to ${meow.email}. Please follow the instructions in it.

  return (
    <>
      <Modal isBlackBackDrop={false} onClose={onClose}>
        <div className="esm">
          <div className="esm-container">
            <div className="esm-header">
              <div className="esm-closer pointer" onClick={() => onClose()}>
                <BsX size={"32px"} />
              </div>
              <h4 className="esm-header-title mb-2">Verification Email</h4>
            </div>
            <div className="esm-content">
              {message.length > 0 ? (
                <span className="text-mute">{message}</span>
              ) : (
                <span className="text-mute">
                  We have sent you a verification email to{" "}
                  <strong>{email}</strong>, please check both your inbox and
                  spam folder.
                </span>
              )}
            </div>
          </div>
          <div className="esm-footer">
            <button className="btn btn-secondary" onClick={() => onClose()}>
              Okay
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmailSentModal;
