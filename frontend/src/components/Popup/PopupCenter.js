import React from "react";
import "./Popup.css";
import { Portal } from "../Portal";

const PopupCenter = ({ children, onClose }) => {
  return (
    <Portal>
      <div className="white-backdrop" onClick={() => onClose()}></div>
      <div className="popup-center">{children}</div>
    </Portal>
  );
};

export default PopupCenter;
