CREATE DATABASE projectdecember;

CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  major VARCHAR(255),
  goal INT,
  type_of_student VARCHAR(255),
  year INT,
  group_preference VARCHAR(255)
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,  -- Unique identifier for each event
    event_name VARCHAR(255) NOT NULL,  -- Name of the event
    event_type INTEGER NOT NULL,  -- Type/category of the event
    tags VARCHAR(255),  -- Tags or labels for the event
    web_link VARCHAR(255),  -- URL link to event details
    start_time TIMESTAMP NOT NULL,  -- Event date and time
    photo VARCHAR(255),  -- Link to a photo for the event
    location VARCHAR(255),  -- Location name or address of the event
    latitude VARCHAR(50),  -- Latitude coordinate
    longitude VARCHAR(50)  -- Longitude coordinate
);

CREATE TABLE event_attendance (
    event_id INTEGER NOT NULL,  -- References the events table
    user_id INTEGER NOT NULL,   -- References the users table
    did_rsvp BOOLEAN NOT NULL,  -- RSVP status: true or false
    PRIMARY KEY (event_id, user_id),  -- Composite primary key for unique attendance
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);