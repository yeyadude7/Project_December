import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./connect.css";
import StickyNavbar from "../../components/StickyNavbar/stickyNavbar.jsx";
import ProfileCard from "../../components/ProfileCard/profileCard.jsx";
import Config from "../../config.js";

const Connect = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchFromURL = async () => {
      const request = await fetch(`${window.location.protocol}//${window.location.hostname}:${Config.SERVER_PORT}/api/user/all`);
      const response = await request.json();
      
      setUsers(response);
    };

    fetchFromURL();
  }, []);

  const searchFilters = ["name", "major", "classes", "interests"];

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [query, setQuery] = useState([]);
  const [onlyLeaders, setOnlyLeaders] = useState(false);

  const getFilteredUsers = () => users.filter((item) => {
    if (onlyLeaders && !item["leader"]) {
      return false;
    }

    // Check if the search by type is undefined
    if (item[searchBy] === undefined)
      return false;

    // Check if the search by type is an array
    if (Array.isArray(item[searchBy])) {
      let match = false;

      // Check for match with each element in the array
      item[searchBy].map((element) => {
        if (element.toLowerCase().includes(searchTerm.toLowerCase())) {
          match = true;
        }

        return element;
      });

      // If there is a match, return the item
      return match;
    }

    // Check for match with the search term based on the search by type
    const searchValue = item[searchBy].toLowerCase();
    return searchValue.includes(searchTerm.toLowerCase());
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(getFilteredUsers());
  };

  const handleModifySearch = (modifier) => {
    setSearchBy(modifier);
  }

  const handleToggleLeaders = () => {
    setOnlyLeaders((prevOnlyLeaders) => !prevOnlyLeaders);
  }

  return (
    users === null ? <div /> :
    <div className="flex flex-col items-center w-svw">
      {/* Header */}
      <div className="absolute left-4 flex items-center justify-between mt-4 mb-6">
        <Link to="/mainprofile">
          <button className="text-blue-500 flex items-center gap-1 text-sm hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} /> Back to Profile
          </button>
        </Link>
      </div>
      <div className="flex flex-col relative items-center justify-center mt-16 mb-28 w-full max-w-lg px-4">
        {/* Sections */}
        <div className="flex flex-col w-full">          
          <h1 className="font-bold text-4xl text-center mb-8">Connect</h1>

          {/* Search Bar */}
          <form className="grid grid-cols-[80%_20%] relative m-auto w-full place-self-center" onSubmit={handleSearch}>
            <input
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Find study & gym partners..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
            <button
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              type="button"
              onClick={handleSearch}
            >
              Search
            </button>
          </form>

          {/* Options */}
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 mt-2">
                {/* Dynamically create search filter buttons */}
                {searchFilters.map((tag, index) => {
                  return (
                    <button key={index} onClick={() => handleModifySearch(tag)} className={"friend_search_tag border-1 border-color-slate-300 hover:bg-sky-200 transition-all " + (searchBy === tag ? "bg-sky-300" : "")}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</button>
                  );
                })}
            </div>
            <div className="flex items-center justify-center mt-2 mb-8">
              <button onClick={() => handleToggleLeaders()} className={"friend_search_tag border-1 border-color-slate-300 hover:bg-sky-200 transition-all " + (onlyLeaders ? "bg-sky-300" : "")}>🏆 Only Show Leaders</button>
            </div>
          </div>

          {/* Profile Cards */}
          <div className="flex items-center justify-center flex-col gap-8">
            {query.length === 0
              ? users?.map((element, key) => {
                  return (
                    <ProfileCard
                      compatability={element.compatability}
                      name={element.name}
                      major={element.major}
                      userID={element.id}
                      year={element.year}
                      bannerImage={element.photo}
                      profilePicture={element.profilePicture}
                      connections={element.connections}
                      classes={element.classes}
                      interests={element.interests}
                      leader={element.leader}
                      key={key}
                    />
                  );
                })
              : query?.map((element, key) => {
                  return (
                    <ProfileCard
                      compatability={element.compatability}
                      name={element.name}
                      major={element.major}
                      userID={element.id}
                      year={element.year}
                      bannerImage={element.photo}
                      profilePicture={element.profilePicture}
                      connections={element.connections}
                      classes={element.classes}
                      interests={element.interests}
                      leader={element.leader}
                      key={key}
                    />
                  );
                })}
          </div>
        </div>
      </div>
      <StickyNavbar />
    </div>
  );
};


export default Connect;
