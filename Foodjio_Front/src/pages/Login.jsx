import React, { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { jwtDecode } from "jwt-decode";
import UserContext from "../context/user";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import logo from "../assets/makan.png";

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
  const [message, setMessage] = useState("");

  useEffect(() => {
    userCtx.setMyName("");
    userCtx.setUserId;
    userCtx.setAccessToken("");
    userCtx.setRefreshToken("");
    localStorage.removeItem("user"); //logout?
  }, []);

  const handleUserLogin = async () => {
    const res = await fetchData("/account/a/login/", "POST", {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(res.data));
      userCtx.setAccessToken(res.data.access);
      userCtx.setRefreshToken(res.data.refresh);

      const decoded = jwtDecode(res.data.access);
      console.log(decoded);
      userCtx.setUserId(decoded.user_id);
      userCtx.setMyName(decoded.name);
      userCtx.setProfilePic(decoded.img);
      navigate("/home");
      setLogin(true);
    } else {
      setMessage("Login Failed");
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
        regNameRef.current.value = "";
        regEmailRef.current.value = "";
        regHpNumRef.current.value = "";
        regPasswordRef.current.value = "";
        setMessage("Registration successful, please login.");
        setShowRegister(false);
      } else {
        console.log(data.message);
        setMessage("Registration failed, one of your fields is invalid.");
      }
    } catch (error) {
      console.log("something really bad has happened");
      console.log(error);
    }
  };
  return (
    <>
      <div className="login">
        <div className="row m-1">
          <div className="leftbox col-3 g-0 d-flex flex-column align-items-center text-center">
            <p>Find people with the same taste as you</p>
            <div>
              <img src={logo} alt="MakanTogether" />
            </div>
            <div>
              <h1 className="title">MakanTogether</h1>
            </div>
            {!showRegister ? (
              <>
                <input type="text" ref={emailRef} placeholder="email"></input>
                <input
                  type="password"
                  ref={passwordRef}
                  placeholder="password"
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      handleUserLogin();
                    }
                  }}
                ></input>
                <button className="mt-3" onClick={() => handleUserLogin()}>
                  Login
                </button>
                <button
                  className="mt-1 text-bg-success"
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  ref={regEmailRef}
                  placeholder="email"
                ></input>
                <input type="text" ref={regNameRef} placeholder="name"></input>
                <input
                  type="text"
                  ref={regHpNumRef}
                  placeholder="mobile number (optional)"
                ></input>
                <input
                  type="password"
                  ref={regPasswordRef}
                  placeholder="password"
                ></input>

                <button
                  className="mt-3 text-bg-success"
                  onClick={() => handleRegister()}
                >
                  Register
                </button>
                <button
                  className="mt-3 text-bg-secondary"
                  onClick={() => setShowRegister(false)}
                >
                  Cancel
                </button>
              </>
            )}
            <div className="container">
              <p className="text-center">{message}</p>
            </div>
          </div>
          <div className="col-9 g-0">
            <Carousel
              autoPlay={true}
              infiniteLoop={true}
              showStatus={false}
              interval={4000}
            >
              <div>
                <img src="https://res.cloudinary.com/dotft2n3n/image/upload/v1714064118/foodjio/DSC05454_avbkcj.jpg" />
                <p className="legend">Legend 1</p>
              </div>
              <div>
                <img src="https://res.cloudinary.com/dotft2n3n/image/upload/v1714064484/foodjio/PXL_20230211_060512046_q7nr7f.jpg" />
                <p className="legend">Legend 2</p>
              </div>
              <div>
                <img src="https://res.cloudinary.com/dotft2n3n/image/upload/v1714064773/foodjio/the-best-top-10-indian-dishes_olmw6n.jpg" />
                <p className="legend">Legend 3</p>
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
