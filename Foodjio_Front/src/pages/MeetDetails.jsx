import React, { useContext, useEffect, useState } from "react";
import "../App.css";
import "./MeetDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import flag from "../assets/flag-triangle-svgrepo-com.svg";

const MeetDetails = () => {
  let makan_id = 0;
  const params = useParams();
  const meetId = params.id;
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();
  const navigate = useNavigate();
  //==============================//
  const [meetData, setMeetData] = useState({});
  const [meetParticipants, setMeetParticipants] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [contactIsLoaded, setContactIsLoaded] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

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
      console.log(res.data);
      setIsLoaded(true);
      setMeetData(res.data);
      if (res.data.author.id === userCtx.userId) {
        setIsAuthor(true);
      }
      if (res.data.abuseflag) {
        setIsFlagged(true);
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
      setMeetParticipants(res.data);
      setContactIsLoaded(true);
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

  const flagEvent = async () => {
    const res = await fetchData(
      "/api/meet/flag/" + meetId + "/",
      "PATCH",
      { abuseflag: !meetData.abuseflag },
      userCtx.accessToken
    );
    if (res.ok) {
      console.log(res);
      setIsFlagged(!isFlagged);
      console.log("event is flagged");
    } else {
      console.log("something went wrong");
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
        <div className="display container d-flex flex-row mt-50">
          <div className="container gx-0">
            <img src={meetData.foodimg} className="meetimg" />
            <div className="py-1">About the organizer:</div>

            <div>
              <ul className="list-group w-75">
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
              {!isFlagged ? (
                <button
                  onClick={() => {
                    flagEvent();
                  }}
                  className="flagbtn mt-1"
                >
                  <img src={flag} width="8%" alt="" className="m-2" />
                  Flag this event for abuse
                </button>
              ) : (
                <button
                  onClick={() => {
                    flagEvent();
                  }}
                  className="flagbtn mt-1"
                >
                  <img src={flag} width="8%" alt="" className="m-2" />
                  Unflag this event for abuse
                </button>
              )}
              <p className="badge text-bg-secondary">
                {isFlagged &&
                  "An admin is checking if this event is against the rules"}
              </p>
            </div>
          </div>
          <div className="detailcontainer mx-2 gx-2 lh-1">
            <h2 className="fs-2">{meetData.title}</h2>
            {isSubscribed && isAuthor && (
              <button
                onClick={() => {
                  navigate(`/meet/${meetData.id}/update`);
                }}
                className="badge round-pill text-bg-success float-end"
              >
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
            <p>
              {meetData.website && (
                <a
                  href={meetData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Menu / Website
                </a>
              )}
            </p>
            <div className="mt-3">
              <p className="p-3 rounded-pill text-bg-secondary">
                Number of People Going:{" "}
                <span className="text-bg-secondary float-end">
                  {meetData.currentnum} / {meetData.maxnum}
                </span>
              </p>
            </div>
            {isAuthor && meetData.is_full && (
              <button
                title="Click for Contact Info!"
                className="collapsebutton"
                data-bs-toggle="collapse"
                data-bs-target="#collapseContact"
              >
                Let's Makan! 💌
              </button>
            )}
            {isAuthor && !meetData.is_full && (
              <button
                className="collapsebutton"
                data-bs-toggle="collapse"
                data-bs-target="#collapseContact"
                disabled={true}
              >
                Event needs to be full to see who's going
              </button>
            )}
            <div className="collapse mt-1" id="collapseContact">
              <div className="card card-body">
                <div className="d-flex flex-row px-2 justify-content-between">
                  <div className="mt-1">Name:</div>
                  <div className="mt-1">email:</div>
                  <div className="mt-1">mobile:</div>
                </div>
                {contactIsLoaded &&
                  meetParticipants.map((entry, index) => {
                    return (
                      <div
                        className={`card p-2 d-flex flex-row justify-content-between ${
                          index % 2 && `oddline`
                        }`}
                      >
                        <div className="mt-1">{entry.name}</div>
                        <div className="mt-1">{entry.email}</div>
                        <div className="mt-1">{entry.hpnum}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="mt-2 buttoncontainer">
              <button
                title="Click to join!"
                className="me-3"
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
                title="Boooo pangseh"
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
