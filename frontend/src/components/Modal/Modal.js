import "./Modal.css";
import React, { useCallback, useEffect } from "react";
import { Portal } from "../Portal";

const Modal = ({ isEsc, isBlackBackDrop, children, onClose }) => {
  const closeOnEscape = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isEsc) document.body.addEventListener("keydown", closeOnEscape);
    document.body.style.overflowY = "hidden";

    return () => {
      if (isEsc) document.body.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflowY = "visible";
    };
  }, [closeOnEscape, isEsc]);

  return (
    <Portal>
      <div
        className={isBlackBackDrop ? "black-backdrop" : "backdrop"}
        onClick={() => onClose()}
      ></div>
      {children}
    </Portal>
  );
};

export default Modal;
