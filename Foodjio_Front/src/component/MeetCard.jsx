import React from "react";

const MeetCard = (props) => {
  return (
    <div className="meetcard">
      <img src={props.imgUrl} className="cardimg" />
      <div className="cardtext">
        <h4>{props.title}</h4>
        <p className="fs-6 fw-light">{props.cuisineType}</p>
      </div>
    </div>
  );
};

export default MeetCard;
