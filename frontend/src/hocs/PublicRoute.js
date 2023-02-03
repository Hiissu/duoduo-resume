import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { LEARN_URL } from "../configs/navigators";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to={LEARN_URL} /> : children;
};

export default PublicRoute;
