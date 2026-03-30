//--------------------------------- BACKEND README -------------------------------------//
# Distributed Task Scheduler (Backend)
## Overview
A backend system designed to handle bulk task ingestion and distribute tasks across agents using a **persistent round-robin scheduling algorithm**.

The system uses **asynchronous queue-based processing** to ensure non-blocking and scalable task handling.

---

## Key Features

- Persistent Round-Robin Scheduling (fair task distribution)
- Asynchronous Queue-Based Processing (non-blocking requests)
- Batch Processing for efficient database operations
- Role-Based Authentication (Admin / Agent)
- Bulk Task Upload via Excel
- MVC Architecture

---

## System Design

![Architecture Diagram](./server/architecture.png)


### Flow
Client → API → Queue → Worker → Round-Robin → Database

### Explanation
- Tasks are pushed into an in-memory queue
- A background worker processes tasks in batches
- Each task is assigned to agents in cyclic order
- Assignment state is stored in MongoDB to maintain continuity across requests

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)

---

## Getting Started

### Install dependencies
    npm install

### Setup environment variables
Create `.env` file:
- PORT=8080
- MONGO_URI=your_mongodb_uri
- DEV_MODE=development

### Run server
    npm start

---

## ⚠️ Limitations
- Queue is currently **in-memory** (data loss on restart)
- Can be extended using **Redis/Kafka**

---

## Future Improvements
- Persistent queue (Redis)
- Horizontal scaling with multiple workers
- Retry mechanism for failed tasks
---

## Key Learnings
- Designing async systems using queue + worker
- Implementing fair scheduling using round-robin
- Efficient bulk processing using batching


/////----------------------  FRONTEND README-----------------///
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


