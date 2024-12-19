import StickyNavbar from "../../components/StickyNavbar/stickyNavbar";
import { ArrowLeft, Plus, X, School, Clock, Heart, Users } from "lucide-react";
import "./aboutme.css";

const AboutMe = () => {

    return (<div>
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
          <Link to="/editprofile">
            <button className="text-blue-500 flex items-center gap-1 text-sm hover:text-blue-600 transition-colors">
              Edit
            </button>
          </Link>
        </div>

        {/* Profile image and name */}

        <div className="flex items-center justify-between">
          <div className="ml-4 bg-gray-200 object-none w-36 h-36 rounded-full custom-position"></div>
          <div>
            <h1 className="mr-4 font-bold text-2xl">Joseph Popa</h1>
            <h2 className="mr-4">Undergraduate Student</h2>
          </div>
        </div>

        {/* University Section */}
        <div>
          <div className="space-y-4">
            <div className="bg-gray-600 text-white px-5 py-2 rounded-2xl mb-4 flex items-center gap-2">
              <School size={18} />
              <span className="text-sm">UNIVERSITY</span>
            </div>
          </div>
          <div class=" rounded overflow-hidden bg-gray-200">
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">
                University of Central Florida
              </div>
              <p class="text-gray-700 text-base">Business Management</p>
              <p class="text-gray-700 text-base">Class of 2025</p>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div>
          <div className="space-y-4">
            <div className="bg-gray-600 text-white px-5 py-2 rounded-2xl mb-4 flex items-center gap-2">
              <Heart size={18} />
              <span className="text-sm">INTERESTS</span>
            </div>
          </div>
          <div class=" rounded overflow-hidden bg-gray-200">
            <div class=" px-6 py-4">
              <div className="flex">
                <div className="interest_tag ">🤖 AI/ML</div>
                <div className="interest_tag ">📷 Photography</div>
                <div className="interest_tag ">🏀 Basketball</div>
                <div className="interest_tag ">♟️ Chess</div>
                <div className="interest_tag ">🎹 Piano</div>

              </div>
            </div>
          </div>
        </div>

        {/* Class Section */}
        <div>
          <div className="space-y-4">
            <div className="bg-gray-600 text-white px-5 py-2 rounded-2xl mb-4 flex items-center gap-2">
              <Clock size={18} />
              <span className="text-sm">CLASS SCHEDULE</span>
            </div>
          </div>
          <div class="mb-2 rounded overflow-hidden bg-gray-200">
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">Mondays & Wednesdays</div>
              <p class="text-gray-700 text-base">
                CS246: Deep Learning - 9:00 AM
              </p>
            </div>
          </div>
          <div class="mb-2 rounded overflow-hidden bg-gray-200">
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">Tuesdays & Thursdays</div>
              <p class="text-gray-700 text-base">
                CS 298: Natural Learning Processing - 2:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
        <StickyNavbar />
    </div>);
}

export default AboutMe;