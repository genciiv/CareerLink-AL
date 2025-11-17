// client/src/routes/EmployerRoute.jsx
import { Navigate } from "react-router-dom";

function EmployerRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "employer" && user.role !== "admin") {
    // nuk je kompani
    return <Navigate to="/" replace />;
  }

  return children;
}

export default EmployerRoute;
