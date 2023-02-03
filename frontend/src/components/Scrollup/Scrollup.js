import "./Scrollup.css";
import React, { useState, useEffect, memo } from "react";
import { BsChevronCompactUp } from "react-icons/bs";

const Scrollup = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled =
      document.body.scrollTop || document.documentElement.scrollTop;
    if (scrolled > 690) setVisible(true);
    else if (scrolled <= 690) setVisible(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour in place of 'smooth' */
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);

    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  }, [toggleVisible]);

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

export default memo(Scrollup);
