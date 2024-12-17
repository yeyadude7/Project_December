import { Link } from "react-router-dom";
import { ArrowLeft, Plus, X, School, Clock, Heart, Users } from "lucide-react";

const Friends = () => {
  return (
    <div className="px-48 relative items-center justify-center bg-white">
      {/* Sections */}
      <div className="space-y-8">
        {/* Header */}
        <div className=" flex items-center justify-between mb-8">
          <Link to="/mainprofile">
            <button className="text-blue-500 flex items-center gap-1 text-sm hover:text-blue-600 transition-colors">
              <ArrowLeft size={16} /> Back to Profile
            </button>
          </Link>
        </div>
        <h1 className="font-bold text-2xl text-center">Connect</h1>

        {/* Search Bar */}
        <div class="flex items-center justify-center">
          <div class="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
            >
              <path
                fill-rule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clip-rule="evenodd"
              />
            </svg>

            <input
              class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Find study & gym partners..."
            />

            <button
              class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              type="button"
            >
              Search
            </button>
          </div>
        </div>


        {/* Profile Cards */}

        <div className=" items-center justify-center">
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">Card 1</div>
            <p class="text-gray-700 text-base">Description</p>
          </div>
        </div>

        <div class="max-w-sm rounded overflow-hidden shadow-lg">
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">Card 2</div>
            <p class="text-gray-700 text-base">Description</p>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default Friends;
