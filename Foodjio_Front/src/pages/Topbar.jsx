import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/user";

const Topbar = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
    userCtx.setMyName("");
  };

  return (
    <div className={`topbar d-flex justify-content-between g-0 m-0 `}>
      <div>
        <Link to={"/home"}>
          <h2 className="align-items-end">FoodJio</h2>
        </Link>
      </div>
      {userCtx.myName && (
        <div className="dropdown">
          <button
            className="btn dropdownbtn dropdown"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {"" || userCtx.myName}
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href="#">
                Action
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  handleLogOut();
                }}
              >
                Logout
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Something else here
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Topbar;
