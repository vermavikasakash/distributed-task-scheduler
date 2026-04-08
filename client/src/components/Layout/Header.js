import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(sessionStorage.getItem("token"));

  const logOutHandler = () => {
    sessionStorage.clear();
    toast.success("Logged Out Successfully");
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1000);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white">
      <div className="container-fluid">
        <Link
          to={isAuthenticated ? "/home-page" : "/"}
          className="navbar-brand"
          style={{ textTransform: "none" }}
        >
          Task Scheduler
        </Link>

        <div>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink to="/home-page" className="nav-link">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/create-task" className="nav-link">
                    Upload Tasks
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="nav-link btn btn-link"
                    onClick={logOutHandler}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Admin Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
