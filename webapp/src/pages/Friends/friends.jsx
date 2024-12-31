import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, X, School, Clock, Heart, Users } from "lucide-react";
import "./friends.css";
import StickyNavbar from "../../components/StickyNavbar/stickyNavbar.jsx";
import Tag from "../../components/Tag/tag.jsx";

const Friends = () => {
  const [friends, setFriends] = useState(() => {
    return [
      {
        name: "Alex Thompson",
        compatability: 95,
        major: "Computer Science",
        graduationYear: 2025,
        profilePicture: "",
        connections: 189,
        classes: "CS246, CS224",
        interests: ["ML/AI", "Fitness"],
        leader: true,
      },
      {
        name: "Maria Rodriguez",
        compatability: 88,
        major: "Computer Science",
        graduationYear: 2024,
        profilePicture: "",
        connections: 256,
        classes: "CS246, CS229",
        interests: ["Algorithms", "Basketball"],
        leader: true,
      },
      {
        name: "John Doe",
        compatability: 71,
        major: "Mathematics",
        graduationYear: 2025,
        profilePicture: "",
        connections: 314,
        classes: "MAC2311, MAC4211",
        interests: ["Chess", "Puzzles"],
        leader: true,
      },
    ];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [query, setQuery] = useState([]);

  const filteredFriends = friends.filter((item) => {
    console.log(searchBy);

    // Only name and major are fully functional
    // Will need to add more logic for other cases
    const searchValue = item[searchBy].toLowerCase();
    return searchValue.includes(searchTerm.toLowerCase());
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(filteredFriends);
  };

  const handleModifySearch = (modifier) => {
    setSearchBy(modifier);
    console.log(searchBy);
  }
  return (
    <div>
      <div className="flex flex-col relative items-center justify-center bg-white mb-20">
        {/* Sections */}
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/mainprofile">
              <button className="text-blue-500 flex items-center gap-1 text-sm hover:text-blue-600 transition-colors">
                <ArrowLeft size={16} /> Back to Profile
              </button>
            </Link>
          </div>
          <h1 className="font-bold text-3xl text-center pb-4">Connect</h1>

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
                placeholder="Find study & gym partners..."
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
          <div className="flex items-center justify-center flex-col pb-4">
            <div className="">
              <button onClick={() => handleModifySearch("name")} className="friend_search_tag border-2 hover:bg-sky-300 focus:bg-sky-200">Name</button>
              <button onClick={() => handleModifySearch("major")} className="friend_search_tag border-2">Major</button>
              <button onClick={() => handleModifySearch("classes")} className="friend_search_tag border-2">Courses</button>
              <button onClick={() => handleModifySearch("interests")} className="friend_search_tag border-2">Interests</button>
              <button onClick={() => handleModifySearch("major")} className="friend_search_tag border-2">Leader</button>
            </div>
          </div>

          {/* Profile Cards */}
          <div className="flex items-center justify-center flex-col">
            {query.length === 0
              ? friends.map((element, key) => {
                  return (
                    <ProfileCard
                      compatability={element.compatability}
                      name={element.name}
                      major={element.major}
                      graduationYear={element.graduationYear}
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
                      graduationYear={element.graduationYear}
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

// Profile card for users in friends page
function ProfileCard(props) {
  return (
    <div className="rounded-3xl overflow-hidden border-1 bg-white shadow-md w-[21rem] relative mb-3">
      <div className="w-full">
        <div className="absolute right-2 top-2 flex gap-2">
          <Tag text={props.compatability + "%"} color="blue" />
          {props.leader === true ? <Tag text="Leader" color="yellow" /> : null}
        </div>
      </div>
      <img className="w-full h-32" href={props.profilePicture}></img>
      <div className="px-3 py-3">
        <div className="flex items-center justify-between gap-10">
          <p className="font-bold text-xl text-zinc-800">{props.name}</p>
          <Tag text={props.connections + " connections"} />
        </div>
        <p className="text-zinc-500">
          {props.major} '{props.graduationYear}
        </p>
        <p className="text-zinc-500 font-medium my-3">{props.classes}</p>
        <div className="flex gap-2">
          {props.interests.map((element, key) => {
            return <Tag text={element} key={key} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Friends;
