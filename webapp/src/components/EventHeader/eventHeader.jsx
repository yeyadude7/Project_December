import { useState } from "react";
import "./eventHeader.css";
import Dropdown from "../Dropdown/dropdown";
import { Link } from "react-router-dom";

const EventHeader = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [query, setQuery] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery();
  };

  const handleModifySearch = (modifier) => {
    setSearchBy(modifier);
    console.log(searchBy);
  }

  return (
    <>
      <div className="">
        
        <div className="mt-2">
          <Link to="/mainprofile">
            <p className="text-sm text-blue-500"> ← Back to profile</p>
          </Link>
        </div>

        {/* Events Title */}
        <div>
          <p className="font-bold text-3xl text-center pb-4">Events</p>
        </div>


        {/* Search Bar */}
        <div className="relative flex items-center justify-center w-fit place-self-center">
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

            <form onSubmit={handleSearch}>
              <input
                className="w-64 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="From workshops to parties..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button
                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button"
                onClick={handleSearch}
              >
                Search
              </button>
            </form>
          </div>

          {/* Options */}
          {/* <div className="flex items-center justify-center flex-col pb-4">
            <div className="">
              <button onClick={() => handleModifySearch("name")} className="friend_search_tag border-2 hover:bg-sky-300 focus:bg-sky-200">Name</button>
              <button onClick={() => handleModifySearch("major")} className="friend_search_tag border-2">Major</button>
              <button onClick={() => handleModifySearch("classes")} className="friend_search_tag border-2">Courses</button>
              <button onClick={() => handleModifySearch("interests")} className="friend_search_tag border-2">Interests</button>
              <button onClick={() => handleModifySearch("major")} className="friend_search_tag border-2">Leader</button>
            </div>
          </div> */}

        
      </div>
    </>
  );
};

export default EventHeader;
