CREATE DATABASE projectdecember;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,                     -- Unique user ID
    name VARCHAR(255) NOT NULL,               -- User's name
    email VARCHAR(255) UNIQUE NOT NULL,       -- User's email
    password VARCHAR(255) NOT NULL,           -- User's hashed password
    major VARCHAR(255),                       -- User's major
    goal INTEGER,                             -- User's goal (integer type)
    photo VARCHAR(255),                       -- URL for user's photo
    type_of_student VARCHAR(50),              -- User type (e.g., Undergraduate)
    year VARCHAR(50),                         -- Academic year (e.g., Senior)
    group_preference VARCHAR(255)             -- Group preference
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,  -- Unique identifier for each event
    event_name VARCHAR(255) NOT NULL,  -- Name of the event
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

CREATE TABLE user_interests (
    user_id INTEGER NOT NULL,
    interest_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE

CREATE TABLE friendship_status (
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    status VARCHAR(10) NOT NULL, -- "pending", "accepted", or "rejected"
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user1_id, user2_id),
    CONSTRAINT fk_user1 FOREIGN KEY (user1_id) REFERENCES users(id),
    CONSTRAINT fk_user2 FOREIGN KEY (user2_id) REFERENCES users(id)
);
