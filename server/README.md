# Distributed Task Scheduler

A small learning project showing how an API can publish tasks to RabbitMQ and
how independent worker processes consume them.

# note
Demo Mode: Since free hosting platforms don't provide an always-on background worker, the deployed demo drains the RabbitMQ queue immediately after publishing using the same worker logic. The Docker/local setup runs the worker as an independent service.

## Flow

```text
Client/UI
    |
    v
API
    | Publish
    v
RabbitMQ (Tasks Queue)
    | Consume
    v
Worker
    |
    v
MongoDB

Failure
   |
   v
Retry Queue
   | TTL Expired
   v
Dead Letter Exchange
   |
   `---------> Tasks Queue
```

- The API validates task uploads and publishes each task to RabbitMQ.
- RabbitMQ gives each message to one available worker.
- Workers create each MongoDB task record, then update it to `PROCESSING` and
  finally `COMPLETED`.
- Failed tasks wait in a retry queue; when the TTL expires, RabbitMQ dead-letters
  them through the configured exchange and routes them back to the tasks queue.
- After the configured retry limit, the task becomes `FAILED`.

## Setup

1. Copy `.env.example` to `.env` and adjust the values.
2. Start RabbitMQ:

   ```bash
   docker run -d --name task-rabbitmq \
     -p 5672:5672 -p 15672:15672 \
     rabbitmq:management
   ```

3. Install and run the API:

   ```bash
   npm install
   npm run dev
   ```

4. In another terminal, run a worker:

   ```bash
   npm run dev:worker
   ```

5. Run more workers in more terminals to see RabbitMQ distribute tasks:

   ```bash
   npm run worker
   ```

The RabbitMQ dashboard is available at `http://localhost:15672`. The default
local login is `guest` / `guest`.

Set `TASK_FAILURE_RATE=0` for always-successful tasks, or use a value from `0`
to `1` to demonstrate retries.
