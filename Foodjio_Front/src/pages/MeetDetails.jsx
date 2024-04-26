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
  const [isAuthor, setIsAuthor] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
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
      userCtx.setUserId(decoded.user_id);
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
      setIsLoaded(true);
      console.log(res.data);
      setMeetData(res.data);
      if (res.data.author.id === userCtx.userId) {
        setIsAuthor(true);
      }
    } else {
      console.log("something went wrong");
      navigate("/login");
    }
  };

  const getParticipants = async () => {
    const res = await fetchData(
      "api/participant/" + meetId + "/count/",
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      for (const entry of res.data) {
        if (userCtx.userId === entry.id) {
          setIsSubscribed(true);
        }
      }
    } else {
      console.log("something went wrong");
      navigate("/login");
    }
  };
  const handleSubscribe = async () => {
    const res = await fetchData(
      "api/meet/" + meetId + "/subscribe/",
      "PUT",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      console.log(res.data);
      setIsSubscribed(true);
    } else {
      console.log("something went wrong");
      console.log(res.error);
      // navigate("/login");
    }
  };

  const handleUnsubscribe = async () => {
    const res = await fetchData(
      "api/meet/" + meetId + "/unsubscribe/",
      "Delete",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      console.log(res.data);
      setIsSubscribed(false);
    } else {
      console.log("something went wrong");
      console.log(res.error);
      // navigate("/login");
    }
  };
  useEffect(() => {
    loginCheck();
  }, []);
  useEffect(() => {
    if (fetchLocalStorage) {
      getMeetDetails();
      getParticipants();
    }
  }, [fetchLocalStorage, isSubscribed]);
  return (
    <>
      {isLoaded ? (
        <div className="container d-flex flex-row m-3">
          <div className="gx-0">
            <img src={meetData.foodimg} className="meetimg" />
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
          <div className="detailcontainer mx-2 gx-2 lh-1">
            <h2 className="fs-2">{meetData.title}</h2>{" "}
            {isSubscribed && isAuthor && (
              <button className="badge round-pill text-bg-success float-end">
                edit page
              </button>
            )}
            <p className="lead fw-medium">{meetData.cuisinetype.name}</p>
            <hr></hr>
            <p className="fw-normal">{meetData.address}</p>
            <p>
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "full",
                timeZone: "Asia/Singapore",
              }).format(new Date(meetData.meetdatetime))}
            </p>
            <p>
              {new Intl.DateTimeFormat("en-GB", {
                timeStyle: "short",
                timeZone: "Asia/Singapore",
              }).format(new Date(meetData.meetdatetime))}
            </p>
            <div className="mt-3">
              <p className="badge rounded-pill text-bg-secondary">
                Number of People Going:
              </p>
              <p>
                {meetData.currentnum} / {meetData.maxnum}
              </p>
            </div>
            <div className="buttoncontainer">
              <button
                className="btn btn-danger me-3"
                disabled={isAuthor || isSubscribed || meetData.is_full}
                onClick={() => {
                  handleSubscribe();
                }}
              >
                Let's Go
              </button>
              {isSubscribed && isAuthor && `You are the organizer of this`}

              {!isSubscribed &&
                meetData.is_full &&
                "This meet is full, sorry :("}
            </div>
            {isSubscribed && !isAuthor && "Yay you are going!"}
            <br></br>
            {isSubscribed && !isAuthor && (
              <button
                className="btn btn-dark mt-3 me-3"
                onClick={() => {
                  handleUnsubscribe();
                }}
              >
                Back out
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center m-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default MeetDetails;
