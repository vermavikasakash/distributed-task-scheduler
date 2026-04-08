# Distributed Task Scheduler (Backend)

A scalable backend system for asynchronous task processing using a Queue → Scheduler → Worker architecture.

---

## Overview

This system decouples task creation from execution using a queue-based design. Tasks are processed asynchronously by workers with retry, backoff, and failure handling.

---

## ⚙️ Architecture

Client → API → Queue → Scheduler → Workers → Result

- **Queue**: Buffers incoming tasks
- **Scheduler**: Assigns tasks using round-robin
- **Workers**: Execute tasks with retry + rate limiting

---

## ✨ Features

- Asynchronous task processing
- Retry with exponential backoff (`nextRetryAt`)
- Per-worker rate limiting
- Round-robin task distribution
- Task lifecycle management:
  - Pending → Processing → Completed / Failed
- Fault tolerance with bounded retries

---

## 🛠 Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB
- JWT Authentication

---

## Getting Started

### 1. Install dependencies
npm install
### 2. Run in development
npm run dev

# Key Concepts
Retry Mechanism: Tasks are retried with exponential backoff
Rate Limiting: Workers process limited tasks per time window
Failure Handling: Tasks marked FAILED after max retries
Decoupling: API and execution are independent