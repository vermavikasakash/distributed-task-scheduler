# Task Scheduler Frontend

## Overview
Frontend application for managing agents and tasks in the Distributed Task Scheduler system.

---

## Features

- Admin & Agent authentication
- Agent management (create/view)
- Bulk task upload via Excel
- Task dashboard for agents and admin
- Integration with backend APIs

---

## Tech Stack
- React.js
- Axios

---

## Getting Started

### Install dependencies
    npm start
---

## Backend Dependency

This frontend interacts with backend APIs: /api/v1/auth/*

Ensure backend server is running before starting frontend.

---

## Notes

- Task assignment is handled entirely in the backend
- Frontend only sends raw task data (no distribution logic)


## 🔐 Demo Credentials

Use the following credentials for testing:

Admin:
email: admin@example.com  
password: password123  

Agent:
email: agent@example.com  
password: password123  

> These are sample credentials for demo purposes.


