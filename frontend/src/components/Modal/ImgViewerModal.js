import "./ImgViewerModal.css";
import React from "react";
import { Modal } from "../../components/Modal";

const ImgViewerModal = ({ imgUrl, onClose }) => {
  return (
    <Modal isBlackBackDrop={false} onClose={onClose}>
      <div className="img-wrapper">
        <img className="img-img" src={imgUrl} alt="" />
      </div>
    </Modal>
  );
};

export default ImgViewerModal;
