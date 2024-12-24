import { Link } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  return (
    <div className="px-48 justify-center items-center">
      {/* Header element */}
      <header className="bg-gray-200 h-28">
        Background image goes here...
      </header>

      {/* Name */}
      <div className="py-4">
        <div className="columns-2">
          <h1 className="text-3xl font-bold">Joseph Popa</h1>
          <Link to="/aboutme">
          <button className="more_tag right-0">More About</button>
          </Link>
        </div>
        {/* Profile description */}
        <div>
          <p>Hey! I'm looking to make new friends. Dm me!</p>
        </div>
      </div>
      {/* Cards */}

      <div className="columns-2">
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

      {/* Upcoming events */}
      <div className="pt-5">
        <div className="columns-2">
          <h1 className="text-3xl font-bold">Upcoming events</h1>
          <button className="more_tag ">10 new</button>
        </div>
        <div>
          <p>Let's connect at one of these events!</p>
        </div>
      </div>

      {/* Cards */}

      <div className="columns-2">
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

    
  );
};

export default Profile;
