import React, { useState, useEffect } from "react";

const MeetCanvas = () => {
  const [cuisineType, setCuisineType] = useState([]);
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
    getCType();
  }, []);
  return <div>New Canvas READY!</div>;
};

export default MeetCanvas;
