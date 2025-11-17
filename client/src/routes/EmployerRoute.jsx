// client/src/routes/EmployerRoute.jsx
import { Navigate } from "react-router-dom";

function EmployerRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  // nëse s’ka fare user → dergo te login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // nëse user-i NUK është employer ose admin → dergo ne faqen kryesore
  if (user.role !== "employer" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // nëse është në rregull → shfaq fëmijët (children)
  return children;
}

export default EmployerRoute;
