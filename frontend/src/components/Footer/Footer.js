import React from "react";
import { BsDiscord } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  ABOUT_URL,
  DISCORD_URL,
  FEATURES_URL,
  HOME_URL,
} from "../../configs/navigators";

const Footer = () => {
  return (
    <>
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <a
          className="d-inline-flex align-items-center link-dark text-decoration-none"
          target="_blank"
          rel="noreferrer"
          href={DISCORD_URL}
        >
          <BsDiscord size={22} className="ms-3 me-2" />
          <span className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
            DuoDuo Community
          </span>
        </a>
        <ul className="nav col-md-4 justify-content-center d-flex">
          <li className="nav-item">
            <Link to={HOME_URL} className="nav-link px-2 text-muted">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to={FEATURES_URL} className="nav-link px-2 text-muted">
              Features
            </Link>
          </li>
          <li className="nav-item">
            <Link to={ABOUT_URL} className="nav-link px-2 text-muted">
              About
            </Link>
          </li>
        </ul>
      </footer>
    </>
  );
};

export default Footer;
