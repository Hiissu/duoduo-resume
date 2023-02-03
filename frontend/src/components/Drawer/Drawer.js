import "./Drawer.css";
import React from "react";
import { Portal } from "../Portal";

const Drawer = ({ width, anchor, onClose, isBackdrop, children }) => {
  const Draw = () => {
    return (
      <div
        className={`drawer drawer-anchor-${anchor}`}
        style={{ width: width }}
      >
        {children}
      </div>
    );
  };

  if (isBackdrop)
    return (
      <Portal>
        <div className="backdrop" onClick={onClose} />
        <Draw />
      </Portal>
    );

  return <Draw />;
};

export default Drawer;
