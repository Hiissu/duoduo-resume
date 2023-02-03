import "./TranOptionsModal.css";
import React, { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { BsX } from "react-icons/bs";
import { WordTranModal, WordSearchTransModal } from "../WordModal";

const TranOptionsModal = ({
  object,
  onCreateTran,
  onClose,
  wordTransUsing,
}) => {
  useEffect(() => {
    var modalCloses = document.querySelectorAll(".tom-close");
    modalCloses.forEach((modalClose) =>
      modalClose.addEventListener("click", onClose)
    );

    return () => {
      modalCloses.forEach((modalClose) =>
        modalClose.removeEventListener("click", onClose)
      );
    };
  }, [onClose]);

  const [option, setOption] = useState(-1);
  const optionForTran = () => {
    switch (option) {
      case 0:
        return (
          <WordTranModal
            onClose={() => setOption(-1)}
            object={object}
            isReadOnly={false}
            isCreate={true}
            onAction={onCreateTran}
          />
        );
      case 1:
        return (
          <WordSearchTransModal
            onClose={() => setOption(-1)}
            object={object}
            wordTransUsing={wordTransUsing}
          />
        );

      default:
        break;
    }
  };

  return (
    <>
      {option > -1 && optionForTran()}
      <Modal isBlackBackDrop={false} onClose={onClose}>
        <div className="tom">
          <div className="tom-container">
            <div className="tom-header">
              <div className="tom-close tom-closer pointer">
                <BsX size={"32px"} />
              </div>
              <div className="tom-header-title">
                Translation for <i>{object.word}</i>
              </div>
            </div>
            <div className="tom-content">
              <button
                className="col btn btn-outline-secondary"
                onClick={() => setOption(0)}
              >
                Create translation
              </button>
              <button
                className="col btn btn-outline-secondary"
                onClick={() => setOption(1)}
              >
                Find translation
              </button>
            </div>
          </div>
          <div className="tom-footer">
            <div className="btn tom-close me-3">Cancel</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TranOptionsModal;
