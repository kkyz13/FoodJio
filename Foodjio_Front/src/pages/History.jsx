import React, { useContext, useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { jwtDecode } from "jwt-decode";
import UserContext from "../context/user";
import MeetCard from "../component/MeetCard";

const History = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [meetList, setMeetList] = useState([{}]);
  const [loaded, setLoaded] = useState(false);

  const [myMeetList, setMyMeetList] = useState([{}]);
  const [myLoaded, setMyLoaded] = useState(false);

  const [fetchLocalStorage, setFetchLocalStorage] = useState(false);

  const loginCheck = () => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const token = JSON.parse(loggedInUser);
      const decoded = jwtDecode(loggedInUser);
      console.log(token);
      userCtx.setAccessToken(token.access);
      userCtx.setRefreshToken(token.refresh);

      //check if access token is expired
      const currentTime = Math.floor(Date.now() / 1000); // convert to seconds
      if (decoded.exp < currentTime) {
        console.log("AccessToken has expired");
        navigate("/login");
      }
      console.log(decoded);
      userCtx.setUserId(decoded.user_id);
      userCtx.setMyName(decoded.name);
      userCtx.setIsAdmin(decoded.is_admin);
      setFetchLocalStorage(true);
    } else {
      console.log("local storage invalid");
      navigate("/login");
    }
  };

  const getMyMeets = async () => {
    try {
      const res = await fetchData(
        `/api/meets/query/?author=` + userCtx.userId,
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        setLoaded(true);
        setMeetList(res.data);
      } else console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const getMyInteractedMeets = async () => {
    try {
      const res = await fetchData(
        `/api/participant/` + userCtx.userId + `/meet/`,
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        setMyLoaded(true);
        setMyMeetList(res.data);
      } else console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    loginCheck();
  }, []);

  useEffect(() => {
    getMyMeets();
    getMyInteractedMeets();
    if (fetchLocalStorage) {
    }
  }, [fetchLocalStorage]);
  return (
    <div className="display container">
      <div className="title m-0">Your Interacted Meets: </div>
      {myLoaded ? (
        <>
          <div className=" d-flex flex-row flex-wrap">
            {myMeetList.length > 0 ? (
              myMeetList.map((entry, id) => {
                return (
                  <Link to={`/meet/` + entry.id} key={entry.id}>
                    <MeetCard
                      key={entry.id}
                      author={entry.author.id}
                      title={entry.title}
                      address={entry.address}
                      website={entry.website}
                      maxnum={entry.maxnum}
                      currentnum={entry.currentnum}
                      isFull={entry.is_full}
                      active={entry.active}
                      cuisineType={entry.cuisinetype.name}
                      flag={entry.abuseflag}
                      isgoing={entry.is_going}
                      imgUrl={entry.foodimg}
                    />
                  </Link>
                );
              })
            ) : (
              <div className="display-6">
                You haven't made any interactions yet.
              </div>
            )}
          </div>
        </>
      ) : (
        <div>Loading:</div>
      )}
      <hr></hr>
      <div className="title m-0">Your Meets: </div>

      {loaded ? (
        <>
          <div className=" d-flex flex-row flex-wrap">
            {meetList.length > 0 ? (
              meetList.map((entry, id) => {
                return (
                  <Link to={`/meet/` + entry.id} key={entry.id}>
                    <MeetCard
                      key={entry.id}
                      author={entry.author.id}
                      title={entry.title}
                      address={entry.address}
                      website={entry.website}
                      maxnum={entry.maxnum}
                      currentnum={entry.currentnum}
                      isFull={entry.is_full}
                      active={entry.active}
                      cuisineType={entry.cuisinetype.name}
                      flag={entry.abuseflag}
                      imgUrl={entry.foodimg}
                    />
                  </Link>
                );
              })
            ) : (
              <div className="display-6">You haven't made any plans.</div>
            )}
          </div>
        </>
      ) : (
        <div>Loading:</div>
      )}
    </div>
  );
};

export default History;
