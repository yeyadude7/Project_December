import { Link } from "react-router-dom";
import "./home.css";
import { SocialIcon } from "react-social-icons";
import StickyNavbar from "../../components/StickyNavbar/stickyNavbar.jsx";
import bannerImage from "../../images/temp_banner_image.jpg";
import christmasImage from "../../images/christmas_image.jpg";
import partyImage from "../../images/party_image.jpg";
import seminarImage from "../../images/seminar_image.jpg";
import concertImage from "../../images/concert_image.jpg";
import profileImage from "../../images/profile_image.jpg";

const Profile = () => {
  return (
    <>
      <div className="grid grid-cols-1 justify-items-center">
        {/* Header element */}
        <div className="w-96 gap-2 columns-2">
          <div>
            {/* Hello */}
            <div className="w-96 pt-4">
              <h1 className="text-xl font-light">Hello</h1>
            </div>
            {/* Name */}
            <div className="pb-4 justify-center items-center">
              <div className="gap-8 columns-2">
                <h1 className="text-3xl font-bold">Joseph</h1>
              </div>
            </div>
          </div>

          {/* Profile pic */}
          <div className="pl-28 pt-4">
            <div className="border-4 border-gray-600 ml-4 bg-gray-200 object-none w-16 h-16 rounded-full custom-position">
              <img
                src={profileImage}
                className="object-fill rounded-full"
              ></img>
            </div>
          </div>
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

          <form
          // onSubmit={handleSearch}
          >
            <input
              className="w-80 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Search events, friends, and even interests..."
              type="text"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              type="button"
              // onClick={handleSearch}
            >
              Search
            </button>
          </form>
        </div>

        {/* Discover */}

        <div class="mt-4 bg-blue-500 w-[400px] h-26 rounded-xl overflow-hidden shadow-lg">
          <div class="px-6 pb-4 pt-2">
            <div className="discover_tag w-16">Tonight</div>
            <p class="pt-2 text-white text-base font-semibold">9 friends are going out!</p>
            <p class="text-white text-xs">Click to see who's going</p>
          </div>
        </div>

        {/* This Week */}
        <div className="pt-8 pr-72">
          <div className="pr-6">
            <h1 className="text-xl font-semibold">This Week</h1>
          </div>
        </div>

        {/* Cards */}

        <div className="pt-2 justify-center items-center">
          <div className="columns-2">
            <div class="w-48 h-32 rounded overflow-hidden shadow-lg">
              <img src={concertImage} className="object-fill"></img>
            </div>

            <div class="w-48 h-32 rounded overflow-hidden shadow-lg">
              <img src={partyImage} className="object-fill"></img>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="pt-8 pr-[260px]">
          <div className="pr-6">
            <h1 className="text-xl font-semibold">Leaderboard</h1>
          </div>
        </div>

        {/* Cards */}

        <div className="pt-2 justify-center items-center">
          <div className="columns-2">
            <div class="w-48 h-32 rounded overflow-hidden shadow-lg">
              <img src={concertImage} className="object-fill"></img>
            </div>

            <div class="w-48 h-32 rounded overflow-hidden shadow-lg">
              <img src={partyImage} className="object-fill"></img>
            </div>
          </div>
        </div>
        
      </div>
      <StickyNavbar />
    </>
  );
};

export default Profile;
