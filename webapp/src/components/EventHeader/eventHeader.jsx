import { useState } from "react";
import "./eventHeader.css";
import Dropdown from "../Dropdown/dropdown";
import { Link } from "react-router-dom";

const EventHeader = () => {
  return (
    <>
      <nav className="bg-gray-200 border-solid border-b-t-2 border-gray-600">
        <div>
          <p className="text-xl font-bold">UCF Events</p>
        </div>
        <div className="mt-2">
          <Link to="/editprofile">
            <p className="text-sm"> ← Back to profile</p>
          </Link>
        </div>
        <div className="mt-2">
          <Dropdown />
        </div>
      </nav>
    </>
  );
};

export default EventHeader;
