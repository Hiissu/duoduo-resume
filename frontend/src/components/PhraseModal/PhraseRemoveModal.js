import "./PhraseRemoveModal.css";
import React, { useEffect } from "react";
import { Modal } from "../Modal";
import { BsX } from "react-icons/bs";

const PhraseRemoveModal = ({ po, onRemove, onClose }) => {
  useEffect(() => {
    var modalCloses = document.querySelectorAll(".prm-close");
    modalCloses.forEach((modalClose) =>
      modalClose.addEventListener("click", onClose)
    );

    return () => {
      modalCloses.forEach((modalClose) =>
        modalClose.removeEventListener("click", onClose)
      );
    };
  }, []);

  const onRemovePhrase = () => {
    onRemove(po);
    onClose();
  };

  return (
    <Modal isBlackBackDrop={false} onClose={onClose}>
      <div className="prm">
        <div className="prm-container">
          <div className="prm-header">
            <div className="prm-close prm-closer pointer">
              <BsX size={"32px"} />
            </div>
            <div className="prm-header-title">Remove Phrase</div>
          </div>
          <div className="hr" />
          <div className="prm-content">
            <div className="prm-content-message">
              Are you you want to remove this phrase <i>{po.phrase}</i>? This
              action cannot be undone.
            </div>
          </div>
        </div>
        <div className="prm-footer">
          <div className="btn prm-close me-3">Cancel</div>
          <button className="btn btn-danger" onClick={() => onRemovePhrase()}>
            Remove Phrase
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PhraseRemoveModal;
