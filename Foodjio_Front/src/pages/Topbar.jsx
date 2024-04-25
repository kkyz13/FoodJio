import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/user";

const Topbar = () => {
  const userCtx = useContext(UserContext);

  return (
    <div className={`topbar d-flex justify-content-between g-0 m-0 `}>
      <div>
        <Link to={"/home"}>
          <h2 className="align-items-end">FoodJio</h2>
        </Link>
      </div>
      <div class="dropdown">
        <button
          class="btn dropdownbtn dropdown"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {userCtx.myName}
        </button>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" href="#">
              Action
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#">
              Another action
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#">
              Something else here
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Topbar;
