// client/src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";

function Navbar() {
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

        {/* Butonat e djathtë */}
        <div className="nav-actions">
          <NavLink to="/login" className="btn btn-ghost">
            Hyr
          </NavLink>
          <NavLink to="/register" className="btn btn-primary">
            Regjistrohu
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
