import FadeInText from "../../components/FadeInText/fadeInText";
import { Link } from 'react-router-dom';

import StickyNavbar from "../../components/StickyNavbar/stickyNavbar.jsx"

const Home = () => {
  return (
    <>
      <div>
        <h1>This is the header</h1>
      </div>
      <div>
        <h1 className="font-bold text-center text-blue-600 text-2xl">
          Explore new events, experience new places, engage with community
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <Link to ="/login">
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login
            </button>
          </Link>

          <Link to = "/signup">
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Sign up
            </button>
          </Link>
        </div>
      </div>
      <StickyNavbar />
    </>
  );
};

export default Home;
