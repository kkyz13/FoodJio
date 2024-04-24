import UserContext from "./context/user";
import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [userId, setUserId] = useState("");
  const [myName, setMyName] = useState("");

  //==============ROUTER BLOCK==============//
  return (
    <>
      <UserContext.Provider
        value={{
          accessToken,
          setAccessToken,
          refreshToken,
          setRefreshToken,
          userId,
          setUserId,
          myName,
          setMyName,
        }}
      >
        <Suspense fallback={<h1>Loading...</h1>}>
          <Routes>
            <Route path="/" element={<Navigate replace to="/Login" />} />
            <Route path="login" element={<Login />} />
            <Route path="home" element={<Home />} />
          </Routes>
        </Suspense>
      </UserContext.Provider>
    </>
  );
}

export default App;
