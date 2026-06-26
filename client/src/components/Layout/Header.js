import React from "react";
import { NavLink, Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white">
      <div className="container-fluid">
        <Link
          to="/"
          className="navbar-brand"
          style={{ textTransform: "none" }}
        >
          Distributed Task Scheduler
        </Link>

        <div>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/create-task" className="nav-link">
                Upload Tasks
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
