// client/src/routes/GuestRoute.jsx
import { Navigate } from "react-router-dom";

function GuestRoute({ children }) {
  const token = localStorage.getItem("token");

  // Nëse ka token → mos lejo login/register, çoje te profili
  if (token) {
    return <Navigate to="/profile" replace />;
  }

  // Nëse s'ka token → lejo faqen (login/register)
  return children;
}

export default GuestRoute;
