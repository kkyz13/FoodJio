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
  const regEmailRef = useRef();
  const regNameRef = useRef();
  const regPasswordRef = useRef();
  const regHpNumRef = useRef();
  const [login, setLogin] = useState();
  const [showRegister, setShowRegister] = useState(false);

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
  const handleRegister = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER + "account/a/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: regEmailRef.current.value,
            name: regNameRef.current.value,
            hpnum: regHpNumRef.current.value,
            password: regPasswordRef.current.value,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log(res);
        console.log("registration successful");
        setShowRegister(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log("something really bad has happened");
      console.log(error);
    }
  };
  return (
    <>
      {/* <button onClick={() => getCType()}>Test Button</button> */}
      <div className="container">
        <div className="row">
          <div className="leftbox col-3 d-flex flex-column mb-3 align-items-center">
            <div>
              <h1 className="title">Foodjio</h1>
            </div>
            {!showRegister ? (
              <>
                <input type="text" ref={emailRef} placeholder="email"></input>
                <input
                  type="password"
                  ref={passwordRef}
                  placeholder="password"
                ></input>
                <button onClick={() => handleUserLogin()}>Login</button>
                <button onClick={() => setShowRegister(true)}>Register</button>
              </>
            ) : (
              <div className="d-flex flex-column">
                <input
                  type="text"
                  ref={regEmailRef}
                  placeholder="email"
                ></input>
                <input type="text" ref={regNameRef} placeholder="name"></input>
                <input
                  type="text"
                  ref={regHpNumRef}
                  placeholder="handphone number"
                ></input>
                <input
                  type="password"
                  ref={regPasswordRef}
                  placeholder="password"
                ></input>
                <button onClick={() => handleRegister()}>Register</button>
                <button onClick={() => setShowRegister(false)}>Cancel</button>
              </div>
            )}
          </div>
          <div className="col-9">
            <div className="d-flex">Image</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
