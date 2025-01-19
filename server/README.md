# Backend Documentation for Project December

Welcome to the backend documentation for **Project December**. This guide outlines how to set up and manage the server-side components of the application.

---

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Database Diagram](#database-diagram)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Installing Dependencies](#installing-dependencies)
  - [Configuration](#configuration)
  - [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [Testing](#testing)
- [Python for Web Scraping](#python-for-web-scraping)

---

## Overview

The backend for **Project December** is a robust system providing RESTful API endpoints to support the frontend application.

---

## Technologies Used

- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for handling API requests.
- **PostgreSQL**: Relational database system.
- **Jest**: Testing framework for unit tests.
- **Selenium (Python)**: Used for web scraping live data (separate from core backend functionality).

---

## Database Diagram

A visual representation of the database schema can be found [here](schema/diagram.pdf). It provides a detailed overview of the relationships and structure of the database.

---

## Prerequisites

Before starting, ensure the following are installed:

- **Node.js**: [Download and Install](https://nodejs.org/)
- **PostgreSQL**: [Download and Install](https://www.postgresql.org/)
- **Python**: Required for Selenium-based web scraping.

Recommended for development:

- **Postman**: Ideal for testing endpoints and checking server responses. [Download and Install](https://www.postman.com/)
- **PgAdmin**: Being able to see the state of the postgres database and tables. [Download and Install](https://www.pgadmin.org/)

For Windows users, it is recommended to use [WSL](https://learn.microsoft.com/en-us/windows/wsl/) or a Linux VM to avoid compatibility issues.

---

## Setup Instructions

### Installing Dependencies

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the `server` directory with the following variables:
   ```text
   DB_HOST=""
   DB_PORT=""
   DB_NAME=""
   DB_USER=""
   DB_PASSWORD=""
   PORT=""
   ```
   Replace the placeholders with your PostgreSQL database details.

### Database Setup

To initialize and manage the database, use the following npm scripts:

- **Set up the database schema**:

  ```bash
  npm run setup-db
  ```

- **Populate the database with dummy data**:

  ```bash
  npm run seed-db
  ```

- **Reset the database** (recreate schema and populate data):
  ```bash
  npm run reset-db
  ```

---

## Running the Server

To start the backend server locally:

1. Ensure your PostgreSQL server is running and the `.env` file is correctly configured.

2. Start the server:
   ```bash
   node server.js
   ```

The server will run on the port specified in your `.env` file (default: `PORT=5000`).

---

## Testing

Unit tests ensure the robustness of the backend logic. To run the tests:

1. Use the following command in the `server` directory:
   ```bash
   npm test
   ```

This will execute all unit tests defined for the backend.

---

## Python for Web Scraping

Web scraping to fetch live data is implemented using **Selenium** in Python. While this functionality is separate from the core backend, it integrates data into the system for dynamic updates.

### Setting up Python for Web Scraping

1. Install Python and a virtual environment manager like `venv` or `virtualenv`.
2. Install required Python libraries (e.g., Selenium):
   ```bash
   pip install selenium
   ```
3. Run the Python scripts located in the `scripts/` folder to perform live data scraping.

---

## Notes

- Use Postman or a similar API client to test API endpoints.
- For detailed API documentation, refer to the comments within the route files.

Feel free to contribute by submitting pull requests or opening issues in the repository!
