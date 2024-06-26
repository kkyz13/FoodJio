import React, { useContext, useEffect, useRef, useState } from "react";
import UploadWidget from "../component/UploadWidget";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();
  const [fetchLocalStorage, setFetchLocalStorage] = useState(false);
  const navigate = useNavigate();

  const [myData, setMyData] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const emailRef = useRef();
  const nameRef = useRef();
  const phoneRef = useRef();
  const oldPasswordRef = useRef();
  const passwordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const [message, setMessage] = useState("");

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
        alert("Something went wrong, dropping back to login");
        navigate("/login");
      }
      userCtx.setUserId(decoded.user_id);
      userCtx.setMyName(decoded.name);
      userCtx.setIsAdmin(decoded.is_admin);

      userCtx.setProfilePic(decoded.img);
      setFetchLocalStorage(true);
    } else {
      alert("Something went wrong, dropping back to login");
      navigate("/login");
    }
  };
  const getProfile = async () => {
    try {
      const res = await fetchData(
        "account/a/getuser/" + userCtx.userId + "/",
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        setMyData(res.data);
      } else {
        alert("Something went wrong, dropping back to login");
        navigate("/login");
      }
    } catch (error) {
      setMessage("Something went really wrong");
    }
  };

  const updateUser = async () => {
    try {
      if (passwordRef.current.value === "") {
        setMessage("Password required to update");
      } else {
        const res = await fetchData(
          "account/a/update/",
          "PATCH",
          {
            old_password: passwordRef.current.value,
            email: emailRef.current.value,
            name: nameRef.current.value,
            hpnum: phoneRef.current.value,
            img: imgUrl,
          },
          userCtx.accessToken
        );
        if (res.ok) {
          setFetchLocalStorage(false);
          navigate("/login/");
        } else {
          setMessage("one of your fields is invalid.");
        }
      }
    } catch (error) {
      // console.log(error);
      setMessage("Something wrong happened");
    }
  };

  const updatePassword = async () => {
    try {
      if (newPasswordRef.current.value !== confirmPasswordRef.current.value) {
        setMessage("Your new password doesn't match");
      } else {
        const res = await fetchData(
          "account/a/update/",
          "PATCH",
          {
            old_password: oldPasswordRef.current.value,
            new_password: emailRef.current.value,
          },
          userCtx.accessToken
        );
        if (res.ok) {
          // console.log("password updated");
          // console.log(res.data);
          setFetchLocalStorage(false);
          navigate("/login/");
        } else {
          setMessage("one of your fields is invalid.");
        }
      }
    } catch (error) {
      // console.log(error);
      setMessage("Something wrong happened");
    }
  };

  useEffect(() => {
    loginCheck();
  }, []);

  useEffect(() => {
    getProfile();
  }, [fetchLocalStorage]);

  useEffect(() => {
    emailRef.current.value = myData.email;
    nameRef.current.value = myData.name;
    phoneRef.current.value = myData.hpnum;
    setImgUrl(myData.img);
  }, [myData]);

  //-------------------------RENDER BLOCK----------------------//
  return (
    <div className="display container">
      <div className="d-flex flex-column text-center">
        <div>{imgUrl && <img src={imgUrl} className="profilepic m-5" />}</div>
        <div className="m-3 mx-5">
          <UploadWidget setImgUrl={setImgUrl} uploadName={"w5tcmue1"}>
            Update Profile Pic
          </UploadWidget>
        </div>
        <h2>Despite Everything, It's still you.</h2>
        {message && `${message}`}
        <div className="row hstack m-1">
          <div className="col-5 text-end">Email:</div>
          <input className="col-4" disabled ref={emailRef} type="text"></input>
        </div>
        <div className="row hstack m-1">
          <div className="col-5 text-end">Name:</div>
          <input className="col-4" ref={nameRef} type="text"></input>
        </div>
        <div className="row hstack m-1">
          <div className="col-5 text-end">Mobile:</div>
          <input className="col-4" ref={phoneRef} type="text"></input>
        </div>
        <div className="row hstack m-1">
          <div className="col-5 text-end">
            Type in your password to update your profile:
          </div>
          <input className="col-4" ref={passwordRef} type="password"></input>
        </div>
        {/* <button
          data-bs-toggle="modal"
          data-bs-target="#updatePasswordModal"
          className="text-bg-primary m-2"
          disabled
        >
          Change password
        </button> */}
        <div className="container my-3">
          <button data-bs-toggle="modal" data-bs-target="#updateModal">
            Update
          </button>
        </div>

        {/* <!-- Update Logout Modal --> */}
        <div className="modal fade" id="updateModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header topbarmol">
                <h1 className="modal-title fs-5 " id="updateModalLabel">
                  Update Notice:
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                Updating would require you to login again.
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
                  className="btn btn-success"
                  onClick={() => {
                    updateUser();
                  }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Password Update Modal */}
        <div className="modal fade" id="updatePasswordModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header text-bg-primary">
                <h1 className="modal-title fs-5 " id="exampleModalLabel">
                  Password Change:
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body d-flex flex-column">
                Updating would require you to login again.
                <input
                  className="m-1"
                  ref={oldPasswordRef}
                  type="password"
                  placeholder="old password"
                ></input>
                <input
                  className="m-1"
                  ref={newPasswordRef}
                  type="password"
                  placeholder="new password"
                ></input>
                <input
                  className="m-1"
                  ref={confirmPasswordRef}
                  type="password"
                  placeholder="type your new password again"
                ></input>
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
                  className="btn btn-success"
                  onClick={() => {
                    updatePassword();
                  }}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
