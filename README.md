# Project December

Welcome to **Project December**! This is the official README providing an overview of the project and instructions for setup.

---

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Cloning the Repository](#cloning-the-repository)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Static Hosting](#static-hosting)

---

## Overview

**Project December** is a full-stack web application designed to facilitate user interaction and event management. The application is built with a robust backend and a responsive, user-friendly frontend.

- **Frontend**: Built using ReactJS and Tailwind CSS for a dynamic and modern user interface.
- **Backend**: Powered by NodeJS with a PostgreSQL database, providing a scalable and efficient server-side framework.

---

## Technologies Used

- **Frontend**: ReactJS, Tailwind CSS
- **Backend**: NodeJS, Express, PostgreSQL
- **Testing**: Jest
- **Development Tools**: npm, WSL (for Windows users), Postman (for API testing)

---

## Getting Started

### Cloning the Repository

To begin, clone the repository to your local environment:

```bash
git clone https://github.com/yeyadude7/Project_December.git
```

---

### Frontend Setup

1. Navigate to the `webapp` directory:
   ```bash
   cd webapp
   ```
2. Install necessary dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
4. Access the application at [http://localhost:3000](http://localhost:3000).

For more detailed information, refer to the [README](webapp/README.md) located in the `webapp` folder.

---

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install necessary dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file with your PostgreSQL database information:
   ```text
   DB_HOST=""
   DB_PORT=""
   DB_NAME=""
   DB_USER=""
   DB_PASSWORD=""
   PORT=""
   ```
4. First-time setup commands:

   - Create the database schema:
     ```bash
     npm run setup-db
     ```
   - Populate dummy data:
     ```bash
     npm run seed-db
     ```
   - Reset the database (schema + dummy data):
     ```bash
     npm run reset-db
     ```

5. Run the backend server:

   ```bash
   node server.js
   ```

6. For testing backend functionality:

   ```bash
   npm test
   ```

For additional details, refer to the [README](server/README.md) located in the `server` folder.

---

## Static Hosting

The current deployment of the application is available at:  
[https://joseph-app-23imd.ondigitalocean.app/](https://joseph-app-23imd.ondigitalocean.app/)

---

## Notes for Developers

- **Development Environment**: Linux (Ubuntu 22.04) is recommended. Windows users are advised to use [WSL](https://learn.microsoft.com/en-us/windows/wsl/) or a VM for a seamless development experience.
- **Testing APIs**: Use tools like Postman or any REST API client for testing backend endpoints.
