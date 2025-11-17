// client/src/components/Navbar.jsx
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar({ theme, onToggleTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Lexo user-in nga localStorage sa herë ndryshon URL-ja
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [location.pathname]); // ⬅ rifreskohet në çdo navigim

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          Career<span>Link</span>
        </Link>

        {/* Menu qendrore */}
        <nav className="nav-links">
          <NavLink to="/jobs" className="nav-link">
            Punë
          </NavLink>
          <NavLink to="/companies" className="nav-link">
            Kompani
          </NavLink>
          <NavLink to="/feed" className="nav-link">
            Rrjeti
          </NavLink>
        </nav>

        {/* Djathtas: theme toggle + auth info */}
        <div className="nav-right">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Ndrysho temën"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {currentUser ? (
            // 🔒 Kur je i futur – vetëm Profili + Dil
            <div className="nav-auth-logged">
              <button
                type="button"
                className="nav-user"
                onClick={goToProfile}
                title="Shko te profili im"
              >
                <div className="nav-avatar">
                  {currentUser.fullName
                    ? currentUser.fullName.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div className="nav-user-info">
                  <span className="nav-user-name">
                    {currentUser.fullName || "Përdorues"}
                  </span>
                  <span className="nav-user-role">
                    {currentUser.role === "employer"
                      ? "Kompani"
                      : currentUser.role === "admin"
                      ? "Admin"
                      : "Kandidat"}
                  </span>
                </div>
              </button>

              <button
                className="btn btn-ghost small"
                type="button"
                onClick={handleLogout}
              >
                Dil
              </button>
            </div>
          ) : (
            // 🔓 Kur NUK je i futur – Hyr / Regjistrohu
            <div className="nav-actions">
              <NavLink to="/login" className="btn btn-ghost">
                Hyr
              </NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Regjistrohu
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
