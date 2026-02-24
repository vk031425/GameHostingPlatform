import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { authData } = useContext(AuthContext);

  //Wait until authentication check finishes
  if (authData.loading) {
    return null; // or a loader component
  }
  if (!authData.isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
