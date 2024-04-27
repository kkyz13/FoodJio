import React, { useContext, useEffect, useRef, useState } from "react";
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
  const [formData, setFormData] = useState();
  const formRef = useRef();
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
      console.log(res.data);
      setMeetList(res.data);
      setLoaded(true);
    } else {
      console.log(res.error);
      navigate("/login");
    }
  };

  const getFilteredMeets = async () => {
    if (formData) {
      try {
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
          params.append(key, value);
        }
        const queryString = params.toString();
        // console.log(queryString); // should log the query string
        const res = await fetchData(
          `/api/meets/query/?${queryString}`,
          "GET",
          undefined,
          userCtx.accessToken
        );
        if (res.ok) {
          setMeetList(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const getCType = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/api/getctype/");
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setCuisineType(data);
      }
    } catch (error) {
      // console.log(error.message);
      console.log("Fetch failed");
    }
  };
  const clearForm = () => {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((button) => {
      button.checked = false;
    });
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

  useEffect(() => {
    getFilteredMeets();
  }, [formData]);
  return (
    <>
      <div className={"display"}>
        <button
          className="newmeetbtn"
          onClick={() => {
            navigate("/meet/new/");
          }}
        >
          New Jio
        </button>
        <div className="d-flex flex-row justify-content-end">
          <button
            className="filterbtn btn btn-secondary me-5"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
          >
            Filter
          </button>
        </div>
        <div
          class="offcanvas offcanvas-end"
          tabindex="-1"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">
              Filter Control Panel
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                setFormData(new FormData(formRef.current));
              }}
            >
              <div className="vstack m-3">
                <label>
                  <input
                    class="radiobutton"
                    type="radio"
                    name="isfull"
                    value="false"
                  ></input>
                  &nbsp;See non-full meetups
                </label>
                <label>
                  <input
                    class="radiobutton"
                    type="radio"
                    name="isfull"
                    value="true"
                  ></input>
                  &nbsp;See full meetups
                </label>
                <div className="mt-3 container d-flex flex-row justify-content-around">
                  <button type="submit" className="">
                    Search
                  </button>
                  <button
                    className="text-bg-secondary"
                    onClick={() => {
                      getMeets();
                      clearForm();
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {loaded ? (
          <div className="meetlist d-flex flex-row flex-wrap">
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
