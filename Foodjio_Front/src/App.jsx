import "./App.css";
import UserContext from "./context/user";
import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Topbar from "./pages/Topbar";

import MeetDetails from "./pages/MeetDetails";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [showUserMenu, setShowUserMenu] = useState("");
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
          <Topbar />
          <Routes>
            <Route path="/" element={<Navigate replace to="/Login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="meet/:id/" element={<MeetDetails />} />
          </Routes>
        </Suspense>
      </UserContext.Provider>
    </>
  );
}

export default App;
