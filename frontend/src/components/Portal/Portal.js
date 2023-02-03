import "./Portal.css";
import React from "react";
import ReactDOM from "react-dom";

const Portal = ({ children }) => {
  return ReactDOM.createPortal(
    <div className="layer">{children}</div>,
    document.querySelector("#portal")
  );
};

export default Portal;
