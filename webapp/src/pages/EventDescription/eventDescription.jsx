import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";
import StickyNavbar from "../../components/StickyNavbar/stickyNavbar.jsx";
import bannerImage from "../../images/temp_banner_image.jpg";
import christmasImage from "../../images/christmas_image.jpg";
import partyImage from "../../images/party_image.jpg";
import seminarImage from "../../images/seminar_image.jpg";
import concertImage from "../../images/concert_image.jpg";
import profileImage from "../../images/profile_image.jpg";

const EventDescription = (props) => {
  return (
    <>
      <div className="grid grid-cols-1 justify-items-center">
        {/* Header element */}

        {/* <div className="bg-gray-200 h-20">
          <img src = {bannerImage} className="object-fill"></img>
        </div> */}

        <div className="pt-4">
          <img
            src={partyImage}
            className="object-cover border-2 border-gray-200 bg-gray-200 object-none w-[400px] h-36 rounded-2xl"
          ></img>
        </div>

        {/* Name */}
        <div className="py-4 justify-center items-center">
          <div className="gap-8 columns-2">
            <h1 className="text-3xl font-bold">{props.title}Current title</h1>
          </div>
          {/* Profile description */}
          <div>
            <p>{props.description}Current Description</p>
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
            <p className="pb-2 font-semibold">Concert videos/pictures/fun!</p>
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

export default EventDescription;
