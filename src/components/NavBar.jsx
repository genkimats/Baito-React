import { Link } from "react-router-dom";
import "../css/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand-link">
          <span style={{ color: "rgb(100, 181, 246)" }}>My</span>
          <span style={{ color: "rgb(2, 136, 209)" }}>Baito</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Manage Workdays
        </Link>
        <Link to="/salary" className="nav-link">
          Check Salary
        </Link>
        <Link to="/settings" className="nav-link">
          Settings
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
