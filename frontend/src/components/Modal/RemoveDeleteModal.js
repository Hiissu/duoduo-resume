import "./RemoveDeleteModal.css";
import React, { useCallback, useEffect } from "react";
import { Modal } from ".";
import { BsX } from "react-icons/bs";

const RemoveDeleteModal = ({
  object,
  action,
  subject,
  bridge,
  target,
  onAction,
  onClose,
}) => {
  const onActionAndClose = useCallback(() => {
    onAction(object);
    onClose();
  }, [object, onAction, onClose]);

  const closeOnEnter = useCallback(
    (e) => {
      if (e.key === "Enter") onActionAndClose();
    },
    [onActionAndClose]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEnter);

    return () => {
      document.body.removeEventListener("keydown", closeOnEnter);
    };
  }, [closeOnEnter]);

  return (
    <Modal isBlackBackDrop={false} onClose={onClose}>
      <div className="rdm">
        <div className="rdm-container">
          <div className="moodal-header">
            <div className="moodal-closer" onClick={() => onClose()}>
              <BsX size={"32px"} />
            </div>
            <div className="moodal-title text-capitalize">
              {action} {subject}
            </div>
          </div>
          <div className="hr" />
          <div className="rdm-content">
            <div className="rdm-message">
              Are you want to {action} this {subject} {bridge + " "}
              <i>{target}</i>? This action cannot be undone.
            </div>
          </div>
        </div>
        <div className="rdm-footer">
          <div className="btn me-3" onClick={() => onClose()}>
            Cancel
          </div>
          <button
            className="btn btn-danger text-capitalize"
            onClick={() => onActionAndClose()}
          >
            {action}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveDeleteModal;
