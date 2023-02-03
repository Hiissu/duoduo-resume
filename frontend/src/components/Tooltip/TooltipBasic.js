import "./Tooltip.css";
import React from "react";

const TooltipBasic = ({ children, text, className }) => {
  return (
    <div className={`tultip `}>
      {children}
      <span className={`tultiptext tultip-top ${className}`}>{text}</span>
    </div>
  );
};

export default TooltipBasic;
