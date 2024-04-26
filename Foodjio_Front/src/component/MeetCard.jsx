import React, { useContext } from "react";
import UserContext from "../context/user";

const MeetCard = (props) => {
  const userCtx = useContext(UserContext);

  return (
    <div
      className={`meetcard ${props.isFull ? "full" : ``} ${
        props.author === userCtx.userId ? "author" : ""
      }`}
    >
      <img src={props.imgUrl} className="cardimg" />
      <div className="cardtext">
        <h4>{props.title}</h4>
        <p className="fs-6 fw-medium">{props.cuisineType}</p>
        <hr></hr>
        <p className="">{props.address}</p>
        <p className="fw-light fst-italic">
          {props.isFull && "this event is full"}
        </p>
        <p className="fw-light fst-italic">
          {props.author === userCtx.userId ? "This is your event" : ""}
        </p>
      </div>
    </div>
  );
};

export default MeetCard;
