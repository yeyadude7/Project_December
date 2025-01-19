import EventHeader from "../../components/EventHeader/eventHeader";
import EventsList from "../../components/EventsList/EventsList";
import StickyNavbar from "../../components/StickyNavbar/stickyNavbar";
import './events.css';

const Events = () => {
  return (
    <div className="px-48 flex justify-center items-center">


      <div className="px-48">
        <EventHeader/>
        <EventsList />
      </div>
      <StickyNavbar />
    </div>
  );
};

export default Events;
