import React, { useState, useEffect } from "react";
import "./EventsList.css";
import Config from "../../config.js";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [currentUser] = useState({
    id: "user-1",
    name: "Current User",
    avatar: "/api/placeholder/32/32",
  });
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state

  useEffect(() => {
    // Fetch events data from the backend
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${Config.API_BASE_URL}:${Config.SERVER_PORT}/api/events/all`);
        // Adjust the endpoint if necessary
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(
          data.map((event) => ({
            ...event,
            attendees: [],
            reactions: {
              car: [],
              friend: [],
              drinks: [],
              romance: [],
            },
          }))
        );
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);
  

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleRSVP = (eventId) => {
    const newEvents = events.map((event) => {
      if (event.id === eventId) {
        const isAttending = event.attendees.find(
          (a) => a.id === currentUser.id
        );
        return {
          ...event,
          attendees: isAttending
            ? event.attendees.filter((a) => a.id !== currentUser.id)
            : [...event.attendees, currentUser],
        };
      }
      return event;
    });
    setEvents(newEvents);
  };

  const handleReaction = (eventId, reactionType) => {
    const newEvents = events.map((event) => {
      if (event.id === eventId) {
        const hasReacted = event.reactions[reactionType].find(
          (u) => u.id === currentUser.id
        );
        return {
          ...event,
          reactions: {
            ...event.reactions,
            [reactionType]: hasReacted
              ? event.reactions[reactionType].filter(
                  (u) => u.id !== currentUser.id
                )
              : [...event.reactions[reactionType], currentUser],
          },
        };
      }
      return event;
    });
    setEvents(newEvents);
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Workshop/Conference": "#a855f7",
      Academic: "#3b82f6",
      "Arts Exhibit": "#ec4899",
      "Concert/Performance": "#22c55e",
      "Tour/Open House/Information Session": "#f97316",
    };
    return colors[category] || "#6b7280";
  };

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return events.map((event) => (
    <div className="event-card w-[21rem]" key={event.id}>
      <div className="event-meta">
        <span>🕒 {formatTime(event.starts)}</span>
        <span>|</span>
        <span>📍 {event.location}</span>
      </div>

      <h3 className="event-title">{event.title}</h3>
      <p className="event-description">{event.description}</p>
      <div className="tags-container">
        <span
          className="category-tag"
          style={{ backgroundColor: getCategoryColor(event.category) }}
        >
          {event.category}
        </span>
        {event.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
        <span className="tag">{event.people} attendees</span>
      </div>

      <div className="social-features">
        <button
          onClick={() => handleRSVP(event.id)}
          className={`rsvp-button ${
            event.attendees.find((a) => a.id === currentUser.id)
              ? "attending"
              : ""
          }`}
        >
          👥{" "}
          {event.attendees.find((a) => a.id === currentUser.id)
            ? "Going"
            : "RSVP"}
          {event.attendees.length > 0 && ` (${event.attendees.length})`}
        </button>

        <button
          onClick={() => handleReaction(event.id, "car")}
          className={`reaction-button ${
            event.reactions.car.find((u) => u.id === currentUser.id)
              ? "active car"
              : ""
          }`}
          title="Looking for carpool"
        >
          🚗
        </button>

        <button
          onClick={() => handleReaction(event.id, "friend")}
          className={`reaction-button ${
            event.reactions.friend.find((u) => u.id === currentUser.id)
              ? "active friend"
              : ""
          }`}
          title="Looking to make friends"
        >
          💝
        </button>

        <button
          onClick={() => handleReaction(event.id, "drinks")}
          className={`reaction-button ${
            event.reactions.drinks.find((u) => u.id === currentUser.id)
              ? "active drinks"
              : ""
          }`}
          title="Looking for social drinking"
        >
          🍹
        </button>

        <button
          onClick={() => handleReaction(event.id, "romance")}
          className={`reaction-button ${
            event.reactions.romance.find((u) => u.id === currentUser.id)
              ? "active romance"
              : ""
          }`}
          title="Looking for romance"
        >
          💌
        </button>
      </div>
    </div>
  ));
};

export default EventsList;
