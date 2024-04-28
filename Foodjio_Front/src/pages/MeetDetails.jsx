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
  const [isActive, setIsActive] = useState(true);
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
      userCtx.setIsAdmin(decoded.is_admin);
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
      setIsActive(res.data.active);
      setIsFlagged(res.data.abuseflag);
    } else {
      console.log("something went wrong");
      navigate("/login");
    }
  };

  const deleteMeet = async () => {
    const res = await fetchData(
      "api/meet/delete/" + meetId + "/",
      "DELETE",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      getMeetDetails();
    } else {
      console.log("something went wrong");
      // navigate("/login");
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

  //------RENDER BLOCK------------------------------------------//
  return (
    <>
      {isLoaded ? (
        <div className="display container-fluid grid">
          <div className="row">
            <div className="col g-3 x-0">
              <img src={meetData.foodimg} className="meetimg" />
              <div className="py-1">About the organizer:</div>

              <div>
                <ul className="list-group w-75">
                  {userCtx.isAdmin && (
                    <li
                      className="list-group-item"
                      data-bs-toggle="tooltip"
                      data-bs-title="author_id"
                    >
                      {meetData.author.id}
                    </li>
                  )}
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
                    disabled={!isActive}
                    onClick={() => {
                      flagEvent();
                    }}
                    className="flagbtn"
                  >
                    <img src={flag} width="8%" alt="" className="m-2" />
                    Flag this event for abuse
                  </button>
                ) : (
                  <button
                    disabled={!isActive}
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
            <div className="col-7 mx-2 gx-2 lh-1">
              <h2 className="fs-2">{meetData.title}</h2>
              {userCtx.isAdmin && (
                <button
                  className={`${
                    isActive ? "text-bg-dark" : "text-bg-success"
                  } float-end`}
                  onClick={() => deleteMeet()}
                >
                  {isActive ? "Delete" : "Restore"}
                </button>
              )}
              {isSubscribed && isAuthor && (
                <>
                  <button
                    disabled={!isActive}
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                    className="badge round-pill text-bg-dark float-end"
                  >
                    delete
                  </button>
                  <button
                    disabled={!isActive}
                    onClick={() => {
                      navigate(`/meet/${meetData.id}/update`);
                    }}
                    className="badge round-pill text-bg-success float-end mx-2"
                  >
                    edit page
                  </button>
                </>
              )}
              <p className="lead fw-medium">{meetData.cuisinetype.name}</p>
              {!isActive && (
                <button className="round-pill text-bg-dark pe-none">
                  This Event is Inactive
                </button>
              )}
              <hr></hr>
              <a
                className="m-0"
                href={`https://maps.google.com/maps?q=${encodeURIComponent(
                  meetData.address
                )}&region=sg`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {meetData.address}
              </a>
              <p className="mt-3">
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
              <div className="hstack mt-3">
                <p className="p-3 rounded-pill text-bg-warning w-50">
                  Number of People Going:{" "}
                  <span className="float-end">
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
              {isAuthor && !meetData.is_full && isActive && (
                <button
                  className="collapsebutton text-bg-secondary"
                  disabled={true}
                >
                  When full you can see who's coming!
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
              </div>{" "}
              {isActive && (
                <>
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
                    {isSubscribed &&
                      isAuthor &&
                      `You are the organizer of this`}

                    {!isSubscribed &&
                      meetData.is_full &&
                      "This meet is full, sorry :("}
                  </div>
                  {isSubscribed && !isAuthor && (
                    <p>
                      <br />
                      Yay you are going! <br />
                      <br />
                      Wait for the host to contact you when this event is full.
                    </p>
                  )}
                  <br></br>
                  {isSubscribed && !isAuthor && (
                    <button
                      title="Boooo pangseh"
                      className="btn btn-dark me-3"
                      onClick={() => {
                        handleUnsubscribe();
                      }}
                    >
                      Back out
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center m-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header text-bg-dark">
              <h1 className="modal-title fs-5 " id="updateModalLabel">
                Delete Notice:
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              This action is undoable, your meet will be archived.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                data-bs-dismiss="modal"
                type="button"
                className="btn btn-dark"
                onClick={() => {
                  deleteMeet();
                }}
              >
                Delete this meet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeetDetails;
