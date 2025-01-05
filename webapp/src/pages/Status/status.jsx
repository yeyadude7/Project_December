import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./status.css";
import { SocialIcon } from "react-social-icons";
import { Switch } from "@material-tailwind/react";
import StickyNavbar from "../../components/StickyNavbar/stickyNavbar.jsx";
import bannerImage from "../../images/temp_banner_image.jpg";
import christmasImage from "../../images/christmas_image.jpg";
import partyImage from "../../images/party_image.jpg";
import seminarImage from "../../images/seminar_image.jpg";
import concertImage from "../../images/concert_image.jpg";
import profileImage from "../../images/profile_image.jpg";

const Status = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <div className="grid grid-cols-1 justify-items-center mb-20">
        <div className="mt-2 pr-[280px]">
          <Link to="/mainprofile">
            <p className="text-sm text-blue-500"> ← Back to profile</p>
          </Link>
        </div>
        {/* Profile Icon */}
        <div className="pt-4">
          <div className="border-4 border-gray-600 bg-gray-200 object-none w-48 h-48 rounded-full custom-position">
            <img src={profileImage} className="object-fill rounded-full"></img>
          </div>
        </div>

        <div className="where_tag mb-4 border-2 border-gray-600">
          <p>Where to?</p>
        </div>

        {/* Tonight */}
        <div class="pt-1 bg-gray-100 w-[400px] h-20 rounded rounded-3xl overflow-hidden shadow-lg">
          <div class="columns-2 px-10 py-6">
            <p>going out tonight?</p>

            <label class="pl-20 pt-0.5 inline-flex items-center me-5 cursor-pointer">
              <input
                type="checkbox"
                value=""
                class="sr-only peer"
                onChange={handleCheckboxChange}
                checked={isChecked}
              />
              <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        {/* Community Status */}
        <div className="pt-8 pb-2 pr-40">
          <div className="pr-6">
            <h1 className="text-xl font-bold">Your Community Status</h1>
          </div>
        </div>

        <div className="w-[400px] h-20 bg-blue-100 rounded rounded-xl overflow-hidden shadow-lg">
          <div className="px-4 pt-3">
            <div className="columns-2 pb-2">
              <p className="font-semibold">Connection Score</p>
              <p className="pl-36 text-blue-500 font-semibold">92%</p>
            </div>
            <div class="w-full bg-blue-200 rounded-full h-2.5 dark:bg-gray-700">
              <div class="bg-blue-500 h-2.5 rounded-full w-8"></div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="pt-4 justify-center items-center">
          <div className="columns-2">
            <div class="w-48 h-24 pt-4 rounded-lg overflow-hidden shadow-lg grid justify-items-center">
              <h1 className="font-bold text-2xl">24</h1>
              <p className="pb-4">Connections</p>
            </div>

            <div class="w-48 h-24 pt-4 rounded-lg overflow-hidden shadow-lg grid justify-items-center">
              <h1 className="font-bold text-2xl">8</h1>
              <p className="pb-4">Study Sessions</p>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="pt-8 pb-2 pr-40">
          <div className="pr-6">
            <h1 className="text-xl font-bold">Recent Achievements</h1>
          </div>
        </div>

        <div class="w-[400px] h-30 rounded rounded-xl overflow-hidden shadow-lg">
          <div class="px-10 py-6">
            <div className="bg-yellow-200 text-yellow-700 rounded-3xl pl-3 mr-40 mb-2">
              🏆 Top Connector
            </div>
            <div className="bg-blue-200 text-blue-700 rounded-3xl pl-3 mr-40 mb-2">
              📚 Study Champion
            </div>
            <div className="bg-green-200 text-green-700 rounded-3xl pl-3 mr-40 mb-2">
              💪 Gym Regular
            </div>
          </div>
        </div>
      </div>
      <StickyNavbar />
    </>
  );
};

export default Status;
