import React from "react";
import "./Popup.css";
import { Portal } from "../Portal";

const PopupTop = ({ children, onClose }) => {
  return (
    <Portal>
      <div className="white-backdrop" onClick={() => onClose()}></div>
      <div className="popup-top">{children}</div>
    </Portal>
  );
};

export default PopupTop;
