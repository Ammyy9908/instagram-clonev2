import React from "react";

function Loading(props) {
  return (
    <>
      <div className="flex flex-row  justify-center items-center my-12 lg:px-14 text-center-webkit">
        <img src="/svg/loader.svg" className="h-24" alt="loader" />
      </div>
    </>
  );
}

export default Loading;
