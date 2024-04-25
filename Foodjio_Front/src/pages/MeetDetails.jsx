import React, { useContext, useEffect, useState } from "react";
import "../App.css";
import "./MeetDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const MeetDetails = () => {
  const params = useParams();
  const meetId = params.id;
  const fetchData = useFetch();
  const navigate = useNavigate();
  const [meetData, setMeetData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const userCtx = useContext(UserContext);
  const [fetchLocalStorage, setFetchLocalStorage] = useState(false);

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
  const loginCheck = () => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const token = JSON.parse(loggedInUser);
      const decoded = jwtDecode(loggedInUser);
      userCtx.setAccessToken(token.access);
      userCtx.setRefreshToken(token.refresh);

      //check if access token is expired
      const currentTime = Math.floor(Date.now() / 1000); // convert to seconds
      if (decoded.exp < currentTime) {
        console.log("AccessToken has expired");
        navigate("/login");
      }
      userCtx.setUserId(decoded.id);
      userCtx.setMyName(decoded.name);
      setFetchLocalStorage(true);
    } else {
      console.log("local storage invalid");
      navigate("/login");
    }
  };
  const getMeetDetails = async () => {
    const res = await fetchData(
      "api/meets/" + meetId + "/",
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      console.log(res.data);
      setIsLoaded(true);
      setMeetData(res.data);
    } else {
      console.log("something went wrong");
      navigate("/login");
    }
  };

  useEffect(() => {
    loginCheck();
  }, []);
  useEffect(() => {
    if (fetchLocalStorage) {
      getMeetDetails();
    }
  }, [fetchLocalStorage]);
  return (
    <>
      {isLoaded ? (
        <div className="container d-flex flex-row m-3">
          <div className="gx-0">
            <img src={meetData.foodimg} className="img-thumbnail" />
            <div>About the organizer:</div>
            <div>
              <ul className="list-group">
                <li
                  className="list-group-item"
                  data-bs-toggle="tooltip"
                  data-bs-title="username"
                >
                  {meetData.author.name}
                </li>
                <li
                  className="list-group-item"
                  data-bs-toggle="tooltip"
                  data-bs-title="email"
                >
                  {meetData.author.email}
                </li>
                <li
                  className="list-group-item"
                  data-bs-toggle="tooltip"
                  data-bs-title="phone number"
                >
                  {meetData.author.hpnum || `No number provided`}
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-2 gx-2 lh-1">
            <h2 className="fs-2">{meetData.title}</h2>
            <p className="lead fw-medium">{meetData.cuisinetype.name}</p>
            <hr></hr>

            <p className="fw-normal">{meetData.address}</p>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center m-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default MeetDetails;
