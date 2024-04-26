import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import MeetCard from "../component/MeetCard";

const Home = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [meetList, setMeetList] = useState([{}]);
  const [cuisineType, setCuisineType] = useState([]);
  const [loaded, setLoaded] = useState(false);
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
      setFetchLocalStorage(true);
    } else {
      console.log("local storage invalid");
      navigate("/login");
    }
  };

  const getMeets = async () => {
    const res = await fetchData(
      "/api/meets/",
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      setMeetList(res.data);
      setLoaded(true);
    } else {
      console.log(res.error);
      navigate("/login");
    }
  };

  const getCType = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/api/getctype/");
      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setCuisineType(data);
      }
    } catch (error) {
      // console.log(error.message);
      console.log("Fetch failed");
    }
  };

  useEffect(() => {
    loginCheck();
  }, []);

  useEffect(() => {
    if (fetchLocalStorage) {
      getMeets();
      getCType();
    }
  }, [fetchLocalStorage]);
  return (
    <>
      <div className={"display"}>
        <div className="d-flex flex-row justify-content-center">
          <button
            className="newmeetbtn"
            onClick={() => {
              navigate("/meet/new/");
            }}
          >
            New Jio
          </button>
        </div>
        {loaded ? (
          <div className="d-flex flex-row flex-wrap">
            {meetList.map((entry, id) => {
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
                    imgUrl={entry.foodimg}
                  />
                </Link>
              );
            })}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
};

export default Home;
