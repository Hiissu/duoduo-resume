import React, { useEffect } from "react";
import "./EmailRequestChangeModal.css";
import { BsX } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "../../../components/Modal";
import { requestChangeEmail } from "../../../store/actions/user";

const EmailRequestChangeModal = ({
  onClose,
  onRequestChange,
  requestChangeEmail,
}) => {
  const dispatch = useDispatch();
  const { meow } = useSelector((state) => state.user);

  const onSendCode = () => {
    (async () => {
      const response = await requestChangeEmail();
      if (response.isuccess) onRequestChange();
      else alert(response.message);
    })();
  };

  return (
    <>
      <Modal isBlackBackDrop={false} onClose={onClose}>
        <div className="ercm">
          <div className="ercm-container">
            <div className="ercm-header">
              <div className="ercm-closer pointer" onClick={() => onClose()}>
                <BsX size={"32px"} />
              </div>
              <h4 className="ercm-header-title mb-2">Verify email address</h4>
              <span className="text-mute">
                We'll need to verify your old email address,{" "}
                <strong>{meow.email}</strong> in order to change it.
              </span>
              <p>
                Lost access to your email? Please contact your email provider to
                regain access.
              </p>
            </div>
          </div>
          <div className="ercm-footer mt-3">
            <button className="btn btn-secondary" onClick={() => onSendCode()}>
              Send Verification Code
            </button>
            <div className="btn me-3" onClick={() => onClose()}>
              Cancel
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmailRequestChangeModal;
