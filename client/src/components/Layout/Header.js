import React from "react";
import { NavLink, Link } from "react-router-dom";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  let user = sessionStorage.getItem("user");
  // console.log("user", user);

  // ?? LOGOUT HANDLER
  const logOutHandler = () => {
    sessionStorage.clear();
    toast.success("Logged Out Successfully");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // ! JSX START
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to={user && "/home-page"} className="navbar-brand" style={{ textTransform:"none"}}>
            Task Scheduler
          </Link>

          <div>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* //?? REGISTER LOGIN LOGOUT */}
              {user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/home-page" className="nav-link ">
                      Dashboard 
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" onClick={logOutHandler}>
                      Logout
                    </NavLink>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <NavLink to="/" className="nav-link">
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
