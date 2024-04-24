import React, { useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const loginCheck = () => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const token = JSON.parse(loggedInUser);
      console.log(token);
      userCtx.setAccessToken(token.access);
      userCtx.setRefreshToken(token.refresh);
      const decoded = jwtDecode(loggedInUser);
      console.log(decoded);
      userCtx.setUserId(decoded.id);
      userCtx.setMyName(decoded.name);
    }
  };

  const getMeets = async () => {
    const res = await fetchData(
      "/api/meets/",
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      console.log(res);
    } else {
      console.log("error");
      console.log(res);
    }
  };
  useEffect(() => {
    loginCheck();
    getMeets();
  }, []);
  return (
    <>
      <div className={`topbar d-flex justify-content-between g-0 m-0 `}>
        <div>
          <h2 className="align-items-end">FoodJio</h2>
        </div>
        <div>Welcome, {userCtx.myName}</div>
      </div>
      <div className={"display"}>
        <div>YOU ARE WINNER!</div>
        <div>{userCtx.accessToken}</div>
      </div>
    </>
  );
};

export default Home;
