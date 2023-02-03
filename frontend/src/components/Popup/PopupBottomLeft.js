import React from "react";
import "./Popup.css";

const PopupBottomLeft = ({ children, isShow }) => {
  return (
    <div className={`popup-bottom-left ${isShow ? "eases-in" : "eases-out"} `}>
      {children}
    </div>
  );
};

export default PopupBottomLeft;
