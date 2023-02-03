import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { LOGIN_URL } from "../configs/navigators";

// const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
//   <Route {...rest} render={(props) => isAuthenticated ? <Component {...props} /> : <Navigate to="/login" /> } /> );

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to={LOGIN_URL} />;
};

export default PrivateRoute;
