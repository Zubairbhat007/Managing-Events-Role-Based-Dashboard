import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "../Dashboard/AdminDashboard";
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  debugger
  if (!user) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }

  // if (adminOnly && user.role == "admin") {
  //   // Redirect non-admin users to a "no access" or user dashboard page
  //   return <Navigate to="/admin/dashboard" replace />;
  // }

  // Render the children if the user is authenticated (and authorized if adminOnly)
  return children;
};

export default PrivateRoute;
