import React, { useCallback, useEffect } from "react";
import "./Popup.css";
import { Portal } from "../Portal";

const Popup = ({ children, coords, onClose }) => {
  const closeOnEscape = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscape);
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflowY = "visible";
    };
  }, [closeOnEscape]);

  return (
    <Portal>
      <div className="white-backdrop" onClick={() => onClose()}></div>
      <div className="popup-container" style={coords}>
        {children}
      </div>
    </Portal>
  );
};

export default Popup;
