// client/src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar({ theme, onToggleTheme }) {
  const navigate = useNavigate();

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const isLoggedIn = !!localStorage.getItem("token");
  const role = user?.role || "candidate"; // candidate | employer | admin

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    "nav-link" + (isActive ? " nav-link-active" : "");

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <span className="logo-badge">Career</span>
            <span className="logo-accent">Link</span>
          </Link>

          {/* Linkët kryesorë – të dukshëm për të gjithë */}
          <nav className="nav-links">
            <NavLink to="/jobs" className={navLinkClass}>
              Punë
            </NavLink>
            <NavLink to="/companies" className={navLinkClass}>
              Kompani
            </NavLink>
            <NavLink to="/feed" className={navLinkClass}>
              Rrjeti
            </NavLink>
          </nav>
        </div>

        {/* Aksionet në të djathtë */}
        <div className="nav-right">
          {/* Dark / light toggle */}
          <button
            type="button"
            className="icon-button theme-toggle"
            onClick={onToggleTheme}
            aria-label="Ndërro temën"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {!isLoggedIn && (
            <>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate("/login")}
              >
                Hyr
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate("/register")}
              >
                Regjistrohu
              </button>
            </>
          )}

          {isLoggedIn && (
            <>
              {/* Linke specifike për rolin */}

              {role === "candidate" && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => navigate("/applications")}
                >
                  Aplikimet e mia
                </button>
              )}

              {(role === "employer" || role === "admin") && (
                <>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => navigate("/employer/jobs")}
                  >
                    Punët e mia
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => navigate("/employer/company")}
                  >
                    Profili kompanisë
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigate("/employer/jobs/new")}
                  >
                    Posto punë
                  </button>
                </>
              )}

              {/* “Chip” i profilit + Dil */}

              <button
                type="button"
                className="profile-chip"
                onClick={() => navigate("/profile")}
              >
                <span className="profile-avatar">
                  {user?.fullName
                    ? user.fullName.charAt(0).toUpperCase()
                    : "U"}
                </span>
                <span className="profile-info">
                  <span className="profile-name">
                    {user?.fullName || "Përdorues"}
                  </span>
                  <span className="profile-role">
                    {role === "employer"
                      ? "Employer"
                      : role === "admin"
                      ? "Admin"
                      : "Kandidat"}
                  </span>
                </span>
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={handleLogout}
              >
                Dil
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
