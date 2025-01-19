import React, { useState, useEffect } from "react";
import "./EventsList.css";
import Config from "../../config.js";

const EventsList = () => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch(
					`${Config.API_BASE_URL}:${Config.SERVER_PORT}/api/event/all`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch events");
				}

				const data = await response.json();

				const formattedEvents = data.map((event) => ({
					id: event.event_id,
					title: event.event_name,
					tags: event.tags?.split(",") || [],
					link: event.web_link,
					startTime: event.start_time,
					endTime: event.end_time,
					photoUrl: event.photo_url,
					location: event.location,
					latitude: event.latitude,
					longitude: event.longitude,
					organization: event.organization,
					sourceUrl: event.source_url,
					attendeesCount: event.no_of_attendees || 0,
				}));

				setEvents(formattedEvents);
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

	if (loading) {
		return <p>Loading events...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	return (
		<div className="flex items-center justify-center flex-col gap-8">
			{events.map((event) => (
				<div className="event-rounded-3xl overflow-hidden border-1 border-slate-300 hover:border-slate-400 bg-white shadow-md hover:shadow-lg focus:shadow-md active:shadow-md w-full relative hover:scale-[1.02] transition-all focus:scale-[0.98] active:scale[0.98]" key={event.id}>
					<div className="event-image-container">
						<img
							src={event.photoUrl}
							alt={event.title}
							className="event-photo"
						/>
					</div>
					<div className="event-details">
						<h3 className="event-title">{event.title}</h3>
						<p className="event-organization">{event.organization}</p>
						<p className="event-meta">
							🕒 {formatTime(event.startTime)} - {formatTime(event.endTime)}
						</p>
						<p className="event-location">📍 {event.location}</p>
						<div className="event-tags">
							{event.tags.map((tag, index) => (
								<span key={index} className="tag">
									{tag}
								</span>
							))}
						</div>
						<a href={event.link} target="_blank" rel="noopener noreferrer">
							Learn More
						</a>
						<p className="event-attendees">Attendees: {event.attendeesCount}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default EventsList;
