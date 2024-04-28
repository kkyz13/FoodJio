import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/user";
import logo from "../assets/makan.png";
const Topbar = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
    userCtx.setMyName("");
    userCtx.setIsAdmin(false);
    userCtx.setUserId("");
  };

  return (
    <div
      className={`topbar d-flex justify-content-between g-0 m-0 ${
        userCtx.isAdmin ? "admin" : ""
      }`}
    >
      <div>
        <Link to={"/home"}>
          <div className="hstack">
            <img src={logo} className="me-1 mb-2" width={`42px`} />
            <h2 className="m-0 align-items-end">MakanTogether</h2>
          </div>
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
            {userCtx.myName}{" "}
            {userCtx.profilePic && (
              <img src={userCtx.profilePic} className="smprofilepic" />
            )}
          </button>
          <ul className="dropdown-menu">
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  navigate("/profile/");
                }}
              >
                Profile
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  navigate("/history/");
                }}
              >
                Jio History
              </a>
            </li>
            <li>
              <a
                className="dropdown-item logout"
                href="#"
                onClick={() => {
                  handleLogOut();
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Topbar;
