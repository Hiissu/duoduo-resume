import React from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const DarkTooltip = ({ children, title, placement }) => {
  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#1d1d1e",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#1d1d1e",
      fontSize: "14px",
      lineHeight: "20px",
      color: "#fff",
    },
  }));

  return (
    <CustomTooltip title={title} placement={placement}>
      {children}
    </CustomTooltip>
  );
};

export default DarkTooltip;
