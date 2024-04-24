import React, { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { jwtDecode } from "jwt-decode";
import UserContext from "../context/user";

const Login = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [login, setLogin] = useState();

  useEffect(() => {
    localStorage.removeItem("user"); //logout?
  }, []);

  const getCType = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/api/getctype/");
      if (res.status === 200) {
        console.log("successful fetch");
        const data = await res.json();
        console.log(data);
      }
    } catch (error) {
      // console.log(error.message);
      console.log("Fetch failed");
    }
  };

  const handleUserLogin = async () => {
    const res = await fetchData("/account/a/login/", "POST", {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    if (res.ok) {
      console.log(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      userCtx.setAccessToken(res.data.access);
      userCtx.setRefreshToken(res.data.refresh);
      const decoded = jwtDecode(res.data.access);
      console.log(decoded);
      userCtx.setUserId(decoded.id);
      userCtx.setMyName(decoded.name);
      navigate("/home");
      setLogin(true);
    } else {
      console.log("Do not pass GO");
    }
  };
  return (
    <>
      <div>
        <h1>Foodjio</h1>
      </div>
      <button onClick={() => getCType()}>Test Button</button>
      <div className="d-flex flex-column mb-3">
        <input type="text" ref={emailRef} placeholder="email"></input>
        <input type="password" ref={passwordRef} placeholder="password"></input>
      </div>
      <button onClick={() => handleUserLogin()}>Login Button</button>
    </>
  );
};

export default Login;
