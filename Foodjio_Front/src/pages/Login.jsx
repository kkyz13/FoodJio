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
      console.log(decoded.user_id);
      userCtx.setUserId(decoded.user_id);
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
                <button className="mt-3" onClick={() => handleUserLogin()}>
                  Login
                </button>
                <button className="mt-1" onClick={() => setShowRegister(true)}>
                  Register
                </button>
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
            <div
              id="carouselAutoplaying"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="https://res.cloudinary.com/dotft2n3n/image/upload/v1714064118/foodjio/DSC05454_avbkcj.jpg"
                    className="d-block w-100"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://res.cloudinary.com/dotft2n3n/image/upload/v1714064484/foodjio/PXL_20230211_060512046_q7nr7f.jpg"
                    className="d-block w-100"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="https://res.cloudinary.com/dotft2n3n/image/upload/v1714062413/foodjio/Chinise-food_zqoyas.jpg"
                    className="d-block w-100"
                  />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
