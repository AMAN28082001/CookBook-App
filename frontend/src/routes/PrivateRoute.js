// src/routes/PrivateRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import { BEFORE_LOGIN_ROUTES } from "../constants/commonConstants";
import { ROUTES } from "../constants/routes";

const PrivateRoute = ({ component: RouteComponent, route }) => {
  const token = localStorage.getItem("token");

  let returnData = null;

  if (token) {
    if (BEFORE_LOGIN_ROUTES.includes(route)) {
      // If logged in but trying to access a "before login" route, redirect to home
      returnData = <Navigate to={ROUTES.HOME} />;
    } else {
      // Logged in and route is a private route => show component
      returnData = <RouteComponent />;
    }
  } else {
    // Not logged in
    if (BEFORE_LOGIN_ROUTES.includes(route)) {
      // Allowed to view login/register
      returnData = <RouteComponent />;
    } else {
      // Trying to access a private route => redirect to login
      returnData = <Navigate to={ROUTES.LOGIN} />;
    }
  }

  return returnData;
};

export default PrivateRoute;
