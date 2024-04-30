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
      userCtx.setIsAdmin(decoded.is_admin);
      userCtx.setProfilePic(decoded.img);
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
        console.log(queryString); // should log the query string
        const res = await fetchData(
          `/api/meets/query/?${queryString}`,
          "GET",
          undefined,
          userCtx.accessToken
        );
        if (res.ok) {
          setMeetList(res.data);
        } else console.log(res);
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

  //===========RENDER BLOCK====================================//
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
          <div class="offcanvas-header text-bg-secondary">
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
                    type="checkbox"
                    name="active"
                    value="true"
                    defaultChecked
                  ></input>
                  &nbsp;See only Active Meets<br></br>
                </label>
                <small className="badge text-bg-secondary">
                  Unchecking this will show all meets{` (including inactive)`}
                </small>
                <br></br>
                <label>
                  <input
                    type="checkbox"
                    name="author"
                    value={`!${userCtx.userId}`}
                  ></input>
                  &nbsp;See only other people's meets<br></br>
                </label>
                <hr></hr>
                <label>
                  <input
                    className="radiobutton"
                    type="radio"
                    name="isfull"
                    value="false"
                  ></input>
                  &nbsp;See available meetups
                </label>
                <label>
                  <input
                    className="radiobutton"
                    type="radio"
                    name="isfull"
                    value="true"
                  ></input>
                  &nbsp;See full meetups
                </label>
                <hr></hr>
                <label>
                  Filter by Cuisine type:
                  <select className="form-select mb-1 w-75" name="cuisinetype">
                    <option value={0}>Select cuisine</option>
                    {cuisineType.map((entry, id) => {
                      return <option value={entry.id}>{entry.name}</option>;
                    })}
                  </select>
                </label>
                <label>
                  Filter by Number of Days Ahead:
                  <input name="datetime" className="form-control w-25"></input>
                </label>
                <small className="float-end m-1 badge text-bg-secondary text-wrap">
                  Leaving this blank will search past events
                </small>
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
            {meetList.length > 0 ? (
              meetList.map((entry, id) => {
                return (
                  <Link to={`/meet/` + entry.id} key={entry.id}>
                    <MeetCard
                      key={entry.id}
                      author={entry.author.id}
                      title={entry.title}
                      address={entry.address}
                      datetime={entry.meetdatetime}
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
              <div className="display-6">
                You need to be less picky with your food.
              </div>
            )}
          </div>
        ) : (
          <div className="vstack d-flex align-items-center m-5">
            <div className="display-6">Loading</div>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
