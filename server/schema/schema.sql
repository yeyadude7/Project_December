-- Drop existing tables
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS event_attendance CASCADE;
DROP TABLE IF EXISTS friendship_status CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    major VARCHAR(255),
    goal INTEGER,
    photo TEXT,
    type_of_student VARCHAR(255),
    year VARCHAR(255),
    group_preference VARCHAR(255)
);

-- Create Interests table
CREATE TABLE interests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create User Interests table
CREATE TABLE user_interests (
    user_id INTEGER REFERENCES users(id),
    interest_id INTEGER REFERENCES interests(id),
    PRIMARY KEY (user_id, interest_id)
);

-- Create Events table
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_type INTEGER NOT NULL,
    event_description TEXT,
    tags VARCHAR(255),
    web_link TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    photo_url TEXT,
    event_location VARCHAR(255),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    organization VARCHAR(255),
    source_url TEXT UNIQUE,
    user_id INTEGER REFERENCES users(id)
);

-- Create Event Attendance table (RSVP system)
CREATE TABLE event_attendance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
    did_rsvp BOOLEAN NOT NULL,
    UNIQUE(user_id, event_id)
);

-- Create Friendship Status table
CREATE TABLE friendship_status (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user1_id, user2_id)
);

-- Create User Activities Table
CREATE TABLE user_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    UNIQUE (user_id, activity_name)
);

