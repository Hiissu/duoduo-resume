import React from "react";
import "./NotFound.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <h2 className="">Sorry, this page isn't available.</h2>
      <p className="">
        The link you followed may be broken, or the page may have been removed.{" "}
        <Link to="/">Go back to DuoDuo.</Link>
      </p>
    </div>
  );
};

export default NotFound;
