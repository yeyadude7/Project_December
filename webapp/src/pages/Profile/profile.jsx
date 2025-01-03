import { Link } from "react-router-dom";
import "./profile.css";
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

        {/* <div className="bg-gray-200 h-20">
          <img src = {bannerImage} className="object-fill"></img>
        </div> */}

        <div className="pr-72 pt-4">
          <div className="border-4 border-gray-600 ml-4 bg-gray-200 object-none w-28 h-28 rounded-full custom-position">
            <img
              src={profileImage}
              className="object-fill rounded-full"
            ></img>
          </div>
        </div>

        {/* Name */}
        <div className="py-4 justify-center items-center">
          <div className="gap-8 columns-2">
            <h1 className="text-3xl font-bold">Joseph Popa</h1>
            <Link to="/aboutme">
              <button className="more_tag right-0">Edit</button>
            </Link>
            <Link to="/status" className="pl-2">
              <button className="status_tag">My Status</button>
            </Link>
          </div>
          {/* Profile description */}
          <div>
            <p>Hey there! I'm looking to make new friends!</p>
          </div>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-2 gap-4 justify-center items-center">
          <div class="w-48 h-32 rounded overflow-hidden shadow-lg">
            <div class="px-6 py-4">
              {/* <div class="font-bold text-xl mb-2">Card 2</div> */}
              <SocialIcon url="www.linkedin.com"></SocialIcon>
              <p class="pt-2 text-gray-700 text-base">Linkedin</p>
              <p class="text-gray-700 text-xs">Let's connect!</p>
            </div>
          </div>

          <div class="w-48 h-32 rounded overflow-hidden shadow-lg">
            <div class="px-6 py-4">
              <div class="font-light text-xl">Hey!</div>
              <div class="font-light text-xl mb-2">Welcome</div>

              {/* <p class="text-gray-700 text-base"></p> */}
            </div>
          </div>
        </div>

        {/* Upcoming events */}
        <div className="pt-8 pr-40">
          <div className="pr-6">
            <h1 className="text-3xl font-light">Upcoming Events</h1>
          </div>
        </div>

        {/* Cards */}

        <div className="pt-4 justify-center items-center">
          <div>
            <p className="pb-2 font-semibold">
              Let's connect at one of these events!
            </p>
          </div>
          <div className="columns-2">
            <div class="w-48 h-32 rounded overflow-hidden shadow-lg">
              <img src={concertImage} className="object-fill"></img>
            </div>

            <div class="w-48 h-32 rounded overflow-hidden shadow-lg">
              <img src={partyImage} className="object-fill"></img>
            </div>
          </div>
        </div>

        {/* Cards */}

        <div className="pt-4 justify-center items-center">
          <div>
            <p className="pb-2 font-semibold">
            Concert videos/pictures/fun!
            </p>
          </div>
          <div className="columns-2">
            <div class="w-48 h-32 rounded overflow-hidden shadow-lg">
              <img src={christmasImage} className="object-fill"></img>
            </div>

            <div class="w-48 h-32 rounded overflow-hidden shadow-lg">
              <img src={seminarImage} className="object-fill"></img>
            </div>
          </div>
        </div>

      </div>
      <StickyNavbar />
    </>
  );
};

export default Profile;
