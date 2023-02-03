import "./Scrollup.css";
import React, { useState, useEffect, memo } from "react";
import { BsChevronCompactUp } from "react-icons/bs";

const ScrollupCustom = ({ parentElement }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled =
      parentElement.current.scrollTop || parentElement.current.scrollTop;
    if (scrolled > 690) setVisible(true);
    else if (scrolled <= 690) setVisible(false);
  };

  const scrollToTop = () => {
    parentElement.current.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour in place of 'smooth' */
    });
  };

  useEffect(() => {
    if (parentElement)
      parentElement.current.addEventListener("scroll", toggleVisible);
    // return window.removeEventListener("scroll", toggleVisible);
  }, []);

  return (
    <button
      className={`btn btn-outline-secondary scroll-up 
      ${visible ? "d-block" : "d-none"}`}
      onClick={scrollToTop}
    >
      <BsChevronCompactUp size={"22px"} />
    </button>
  );
};

export default memo(ScrollupCustom);
