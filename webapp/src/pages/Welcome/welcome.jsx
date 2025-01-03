import FadeInText from "../../components/FadeInText/fadeInText";
import { Link } from "react-router-dom";
import QuoteLine from "../../components/QuoteLine/quoteLine.jsx";
import StickyNavbar from "../../components/StickyNavbar/stickyNavbar.jsx";

const Welcome = () => {
  return (
    <>
      <div className="flex flex-col relative items-center justify-center bg-white mb-20">
        <h1 className="pt-20 pr-20 text-5xl font-light">Connect</h1>

        <QuoteLine/>

        <h1 className="pr-14 flex font-semibold text-center text-xl">
          Explore new events
        </h1>
        <h1 className="pr-7 flex font-semibold text-center text-xl">
          Experience new places
        </h1>
        <h1 className="pr-3 flex font-semibold text-center text-xl">
          Engage with community
        </h1>

        <QuoteLine/>

        <div className="grid grid-cols-2 gap-4">
          <Link to="/login">
            <button
              type="submit"
              className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button
              type="submit"
              className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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

export default Welcome;
