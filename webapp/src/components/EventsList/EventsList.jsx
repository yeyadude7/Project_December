import React, { useState } from "react";
import "./EventsList.css";

const EventsList = () => {
  const [events, setEvents] = useState(
    [
      {
        id: "919908",
        title: "Safety and Self-Care: Relationships and Connections",
        description:
          "This workshop will focus on learning about the impact a traumatic experience can have on a person's relationships and social functioning.",
        location: "Virtual",
        virtual_url: "https://ucf-hipaa.zoom.us/j/97245375228",
        starts: "Fri, 22 Nov 2024 09:30:00 -0500",
        category: "Workshop/Conference",
        tags: [
          "Counseling and Psychological Services",
          "self care",
          "relationships",
          "trauma",
          "mental health",
        ],
        people: 5
      },
      {
        id: "894110",
        title: "Inclusive Education Services On-Campus Tour",
        description:
          "Visit Inclusive Education Services (IES) for an on-campus tour. During the on-campus IES tour, families can visit the IES facilities, meet members of the IES team, explore the UCF main campus and learn more about the program.",
        location: "Ferrel Commons: 7B, Suite 132",
        registration_link:
          "https://ucf.qualtrics.com/jfe/form/SV_3fvspvr3VjHSBXE",
        starts: "Fri, 22 Nov 2024 10:00:00 -0500",
        category: "Tour/Open House/Information Session",
        tags: [
          "Inclusive Education Services",
          "Inclusive",
          "IES",
          "campus tour",
        ],
        people: 7
      },
      {
        id: "894116",
        title: "Drop-in Drafting Lab",
        description:
          "Starting a writing assignment, and don't know where to begin? The University Writing Center's Drop-In Drafting Lab can help!",
        location: "Trevor Colbourn Hall 109",
        starts: "Fri, 22 Nov 2024 12:00:00 -0500",
        category: "Academic",
        tags: ["Writing Lab", "writing", "University Writing Center"],
        people: 10
      },
      {
        id: "887364",
        title: "Arts Innovation Competition",
        description:
          "Join UCF's artistic and cultural innovation competition, where we challenge students to present projects that create aesthetic, social, and financial value from novel offerings in the arts, fashion, film, and other cultural industries.",
        location: "Student Union: The Blackstone LaunchPad",
        starts: "Fri, 22 Nov 2024 15:00:00 -0500",
        category: "Workshop/Conference",
        tags: [
          "entrepreunership",
          "Start Ups",
          "UCF Blackstone Launchpad",
          "Arts Innovation Competition",
        ],
        people: 20
      },
      {
        id: "922281",
        title: "Inclusive Education Services On Campus Virtual Tour",
        description:
          "The Inclusive Education Services program provides an inclusive, comprehensive, non-degree-seeking college experience to adults with intellectual disabilities.",
        location: "Virtual",
        virtual_url: "https://ucf.zoom.us/j/95591844132",
        starts: "Fri, 22 Nov 2024 15:00:00 -0500",
        category: "Tour/Open House/Information Session",
        tags: ["IES Inclusive Education Services Inclusive"],
        people: 2
      },
      {
        id: "865975",
        title: "Art Knight! 2024",
        description:
          "The School of Visual Arts & Design is hosting its third annual Art Knight! event November 22, 2024, at the Visual Arts Building at UCF's main campus.",
        location: "Visual Arts Building",
        registration_link:
          "https://www.ticketsource.us/ucf-art-gallery/art-knight-bfa-opening-reception/e-jbryjr",
        starts: "Fri, 22 Nov 2024 18:00:00 -0500",
        category: "Tour/Open House/Information Session",
        tags: [
          "Art Knight!",
          "UCF School of Visual Arts and Design",
          "ucf art gallery",
          "UCF SVAD",
          "Open House",
        ],
        people: 8
      },
      {
        id: "912610",
        title: "UCF Symphony Orchestra Concert",
        description:
          "The UCF Symphony Orchestra is a full orchestra with strings, brass, woodwind and percussion. The group performs literature of the highest caliber by master composers such as Bach, Beethoven and Mahler.",
        location: "St. Luke's Lutheran Church",
        starts: "Fri, 22 Nov 2024 19:00:00 -0500",
        category: "Concert/Performance",
        tags: ["Music", "ucf music"],
        people: 30
      },
    ].map((event) => ({
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

  const [currentUser] = useState({
    id: "user-1",
    name: "Current User",
    avatar: "/api/placeholder/32/32",
  });

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

  
  return events.map((event) => (
    <>
      <div className="event-card w-[21rem]" key={event.id}>
        <div className="event-meta">
          <span>🕒 {formatTime(event.starts)}</span>
          <span>|</span>
          <span>📍 {event.location}</span>
        </div>

        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>
        {/* <p className="event-description">{event.people} people attending</p> */}
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

        {(event.virtual_url || event.registration_link) && (
          <div className="event-links">
            {event.virtual_url && (
              <a
                href={event.virtual_url}
                target="_blank"
                rel="noopener noreferrer"
                className="event-link"
              >
                Join Virtual Event ↗
              </a>
            )}
            {event.registration_link && (
              <a
                href={event.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="event-link"
              >
                Register for Event ↗
              </a>
            )}
          </div>
        )}
      </div>
    </>
  ));
};

export default EventsList;
