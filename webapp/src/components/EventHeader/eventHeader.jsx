import { useState } from "react";
import "./eventHeader.css";
import Dropdown from "../Dropdown/dropdown";

const EventHeader = () => {
  return (
    <>
      <nav className="bg-gray-200 border-solid border-b-t-2 border-gray-600">
        <div>
          <p className="text-xl font-bold">UCF Events</p>
        </div>
        <div className="mt-2">
          <p className="text-sm"> ← Back to profile</p>
        </div>
        <div className="mt-2">
          <Dropdown />
        </div>
      </nav>
    </>
  );
};

export default EventHeader;
