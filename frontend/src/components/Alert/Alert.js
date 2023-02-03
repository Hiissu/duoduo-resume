import "./Alert.css";
import React, { forwardRef } from "react";
import { BsCheck2Circle, BsExclamationCircle } from "react-icons/bs";

const Alert = forwardRef(({ message, severity }, ref) => {
  const AlertMessage = () => {
    switch (severity) {
      case "danger":
        return (
          <>
            <div className="text-danger fw-bold alert-alert">
              Error <BsExclamationCircle size={22} className="ms-2" />
            </div>
            <div className="hr" />
            <span className="text-pink">{message}</span>
          </>
        );

      case "success":
        return (
          <>
            <div className="text-success fw-bold alert-alert">
              Success <BsCheck2Circle size={22} className="ms-2" />
            </div>
            <div className="hr" />
            <span className="text-green">{message}</span>
          </>
        );

      default:
        break;
    }

    return;
  };

  return (
    <div className="alert" ref={ref}>
      <div className="alert-container">
        <div className="alert-content">
          <AlertMessage />
        </div>
      </div>
    </div>
  );
});

export default Alert;
