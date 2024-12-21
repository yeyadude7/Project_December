import EventHeader from "../../components/EventHeader/eventHeader";
import EventsList from "../../components/EventsList/EventsList";
import './events.css';

const Events = () => {
  return (
    <div className="px-48 flex justify-center items-center">


      <div className="">
        <EventHeader/>
        <EventsList />
      </div>
    </div>
  );
};

export default Events;
