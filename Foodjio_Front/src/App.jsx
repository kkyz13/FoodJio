import "./App.css";
import UserContext from "./context/user";
import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Topbar from "./pages/Topbar";
import MeetDetails from "./pages/MeetDetails";
import MeetCanvas from "./pages/MeetCanvas";
import Profile from "./pages/Profile";

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
          <Topbar />
          <Routes>
            <Route path="/" element={<Navigate replace to="/Login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/meet/new/" element={<MeetCanvas />} />
            <Route path="/meet/:id/update/" element={<MeetCanvas />} />
            <Route path="/meet/:id/" element={<MeetDetails />} />
            <Route path="/profile/" element={<Profile />}></Route>
          </Routes>
        </Suspense>
      </UserContext.Provider>
    </>
  );
}

export default App;
