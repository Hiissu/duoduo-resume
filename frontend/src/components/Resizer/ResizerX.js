import React from "react";
import "./ResizerX.css";

const ResizerX = () => {
  const onMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    const clientX = e.clientX;
    const resizer = document.querySelector(".resizer-x");
    const deltaX = clientX - (resizer._clientX || clientX);
    resizer._clientX = clientX;
    const l = resizer.previousElementSibling;
    const r = resizer.nextElementSibling;

    // for Left
    if (deltaX < 0) {
      const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
      l.style.flex = `0 ${w < 10 ? 0 : w}px`;
      r.style.flex = "1 0";
    }

    // for Right
    if (deltaX > 0) {
      const wi = Math.round(parseInt(getComputedStyle(r).width) - deltaX);
      r.style.flex = `0 ${wi < 10 ? 0 : wi}px`;
      l.style.flex = "1 0";
    }
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    delete e._clientX;
  };
  return <div className="resizer-x" onMouseDown={onMouseDown}></div>;

  // return (
  //   <div className="handle-YpRSjIvk" onMouseDown={onMouseDown}>
  //     <div className="control-YpRSjIvk"></div>
  //   </div>
  // );
};

export default ResizerX;
