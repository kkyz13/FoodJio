import React, { useState, useContext, useEffect, useRef } from "react";
import UploadWidget from "../component/UploadWidget";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import presetUrls from "../assets/presetimg";
import "./MeetDetails.css";

const MeetCanvas = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const params = useParams();
  const meetId = params.id;
  const userCtx = useContext(UserContext);
  const [fetchLocalStorage, setFetchLocalStorage] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [meetData, setMeetData] = useState([]);

  const [customUpload, setCustomUpload] = useState(false);
  const [selectedCuisineId, setSelectedCuisineId] = useState("");
  const [cuisineType, setCuisineType] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const titleRef = useRef();
  const dateRef = useRef();
  const timeRef = useRef();
  const addressRef = useRef();
  const linkRef = useRef();
  const [capacity, setCapacity] = useState();

  const loginCheck = () => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const token = JSON.parse(loggedInUser);
      const decoded = jwtDecode(loggedInUser);
      userCtx.setAccessToken(token.access);
      userCtx.setRefreshToken(token.refresh);

      //check if access token is expired
      const currentTime = Math.floor(Date.now() / 1000); // convert to seconds
      console.log(`${currentTime} vs ${decoded.exp}`);
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

  const getCType = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/api/getctype/");
      if (res.status === 200) {
        const data = await res.json();
        setCuisineType(data);
      }
    } catch (error) {
      // console.log(error.message);
      console.log("Fetch failed");
    }
  };
  const populateForm = async () => {
    if (meetId) {
      const res = await fetchData(
        "api/meets/" + meetId + "/",
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log(res.data); //populate the form
        setIsUpdate(true);
        const data = res.data;
        setMeetData(data);
        titleRef.current.value = data.title;
        setSelectedCuisineId(data.cuisinetype.id);
        addressRef.current.value = data.address;
        linkRef.current.value = data.website;
        setCapacity(data.maxnum);
        //time input============//
        const d = new Date(data.meetdatetime);

        dateRef.current.value = d.toISOString().slice(0, 10);
        timeRef.current.value = d.toLocaleTimeString([], {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        //=======================//
      } else {
        console.log("something went wrong");
        navigate("/login");
      }
    }
  };
  const submitEvent = async () => {
    try {
      const res = await fetchData(
        "/api/meet/add/",
        "PUT",
        {
          title: titleRef.current.value,
          address: addressRef.current.value,
          cuisinetype: selectedCuisineId,
          meetdatetime:
            dateRef.current.value + "T" + timeRef.current.value + "+08:00",
          foodimg: imgUrl,
          website: linkRef.current.value,
          maxnum: capacity,
        },
        userCtx.accessToken
      );
      if (res.ok) {
        console.log("new event submitted successfully!");
        navigate("/home/");
      } else {
        console.log("new event submission failed!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateEvent = async () => {
    try {
      if (capacity < meetData.currentnum) {
        return alert(
          "You cannot decrease the capacity below the number of people already going."
        );
      }
      const res = await fetchData(
        "/api/meet/update/" + meetId + "/",
        "PATCH",
        {
          title: titleRef.current.value,
          address: addressRef.current.value,
          cuisinetype: selectedCuisineId,
          meetdatetime:
            dateRef.current.value + "T" + timeRef.current.value + "+08:00",
          foodimg: imgUrl,
          website: linkRef.current.value,
          maxnum: capacity,
        },
        userCtx.accessToken
      );
      if (res.ok) {
        console.log("event updated successfully!");
        navigate("/home/");
      } else {
        console.log(res);
        return alert("Error: Your title isn't long enough");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loginCheck();
  }, []);

  useEffect(() => {
    if (!customUpload) {
      setImgUrl(presetUrls[selectedCuisineId]);
    }
  }, [selectedCuisineId]);

  useEffect(() => {
    getCType();
    if (meetId) {
      populateForm();
    }
  }, [fetchLocalStorage]);

  return (
    <>
      <div className="display container-fluid m-50 row">
        <div className="d-flex flex-column col-4">
          {imgUrl && <img src={imgUrl} />}
          {customUpload && (
            <>
              <UploadWidget setImgUrl={setImgUrl}></UploadWidget>
            </>
          )}
          {!customUpload ? (
            <button
              className="btn btn-dark btn-sm mt-3"
              onClick={() => {
                setCustomUpload(true);
              }}
            >
              Set to Custom Upload
            </button>
          ) : (
            <button
              className="btn btn-dark btn-sm mt-3"
              onClick={() => {
                setCustomUpload(false);
              }}
            >
              Set to Preset Images
            </button>
          )}
        </div>
        <div className="d-flex flex-column col-7">
          <input
            ref={titleRef}
            className="titlewriter mb-1"
            type="text"
            placeholder="title"
          ></input>
          <select
            className="form-select mb-1 w-75"
            aria-label="Default select example"
            value={selectedCuisineId}
            onChange={(e) => setSelectedCuisineId(e.target.value)}
          >
            <option defaultValue={0}>Select cuisine</option>
            {cuisineType.map((entry, id) => {
              return <option value={entry.id}>{entry.name}</option>;
            })}
          </select>
          <input
            ref={addressRef}
            className="addresswriter mb-1"
            type="text"
            placeholder="address"
          ></input>
          <div className="mb-1">
            <input
              readOnly={userCtx.role === "user" ? true : false}
              ref={dateRef}
              type="date"
            ></input>
            <input
              readOnly={userCtx.role === "user" ? true : false}
              ref={timeRef}
              type="time"
            ></input>{" "}
            Singapore Time
          </div>
          <input
            ref={linkRef}
            className="addresswriter mb-1"
            type="text"
            placeholder="Restaurant website/menu (optional)"
          ></input>
          {meetId && (
            <p className="float-end">
              Current number of people going: {meetId && meetData.currentnum}
            </p>
          )}

          <select
            value={capacity}
            className="form-select-sm mb-1 capselector"
            onChange={(e) => setCapacity(e.target.value)}
          >
            <option defaultValue={2}>Select number of people</option>
            {Array.from({ length: 7 }, (_, i) => {
              return <option value={i + 2}>{i + 2}</option>;
            })}
          </select>
          {!isUpdate ? (
            <button
              className="mt-3"
              onClick={() => {
                submitEvent();
              }}
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => {
                updateEvent();
              }}
              className="mt-3 text-bg-success"
            >
              Update
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MeetCanvas;
