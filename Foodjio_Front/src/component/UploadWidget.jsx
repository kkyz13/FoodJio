import React, { useEffect, useRef, useState } from "react";

const UploadWidget = (props) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dotft2n3n",
        uploadPreset: props.uploadName,
      },
      function (error, result) {
        console.log(result);
        if (result.event === "success") {
          props.setImgUrl(result.info.url);
          console.log("img upload successful");
        }
      }
    );
  }, []);
  return (
    <>
      <button
        className={`btn btn-primary`}
        onClick={() => {
          widgetRef.current.open();
        }}
      >
        {props.children}
      </button>
    </>
  );
};

export default UploadWidget;
