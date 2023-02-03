import "./Portal.css";
import React from "react";
import ReactDOM from "react-dom";

const PortalWithOutLayer = ({ children }) => {
  return ReactDOM.createPortal(
    <>{children}</>,
    document.querySelector("#portal")
  );
};

export default PortalWithOutLayer;
