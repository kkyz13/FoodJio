import React, { useContext } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();
  return (
    <div className="display container">Despite Everything, It's still you.</div>
  );
};

export default Profile;
