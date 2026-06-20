# JavaScript MVC Architecture Quick Reference

## Project Structure Overview

```
Distributed Task Scheduler (JavaScript Version)
│
├── app.js                    ← Entry point
│
├── modules/                  ← Feature modules (organized by domain)
│   │
│   ├── auth/                 ← Authentication module
│   │   ├── infrastructure/   ← Database layer (Models, Repositories)
│   │   └── presentation/     ← API layer (Controllers, Routes, Middleware)
│   │
│   ├── task/                 ← Task management module
│   │   ├── application/      ← Business logic (Services)
│   │   ├── domain/           ← Core logic (Entities)
│   │   ├── infrastructure/   ← Data access (Models, Repositories)
│   │   └── presentation/     ← API layer (Controllers)
│   │
│   └── scheduler/            ← Task scheduling module
│       ├── bootstrap/        ← Initialization
│       └── domain/           ← Scheduling logic
│
└── shared/                   ← Shared utilities
    ├── config/               ← Database config
    └── enums/                ← Constants and enums
```

## MVC Pattern Explained

### **Model** (Infrastructure Layer)
Handles data persistence and schema definitions.

**Files**: `*Model.js`, `*Repository.js`  
**Responsibility**: Database operations  
**Location**: `infrastructure/` folders

```javascript
// Example: UserModel.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true }
});

const UserModel = mongoose.model("users", userSchema);
```

```javascript
// Example: UserRepository.js
class UserRepository {
  async getUserByEmail(email) {
    return UserModel.findOne({ email });
  }
}
```

---

### **View** (Presentation Layer)
Handles HTTP requests/responses, validation, and routing.

**Files**: `*Controller.js`, `*Routes.js`, `*Middleware.js`  
**Responsibility**: API endpoints and HTTP handling  
**Location**: `presentation/` folders

```javascript
// Example: authController.js
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userRepo.getUserByEmail(email);
    // ... validation and response
    res.send({ success: true, token });
  } catch (error) {
    res.status(500).send({ error });
  }
};
```

---

### **Controller** (Application/Domain Layer)
Orchestrates business logic and coordinates models with views.

**Files**: `*Service.js`, `*Strategy.js`  
**Responsibility**: Business logic orchestration  
**Location**: `application/` and `domain/services/` folders

```javascript
// Example: TaskService.js
class TaskService {
  async createTasks(tasks) {
    const taskObjects = tasks.map(payload => new Task(uuidv4(), payload));
    await Promise.all(taskObjects.map(t => this.taskRepo.createTaskRecord(t)));
    taskQueue.enqueueBulk(taskObjects);
    scheduler.schedule();
  }
}
```

---

## Common Development Tasks

### Adding a New Module

1. Create directory structure:
```
src/modules/mymodule/
├── application/
│   └── services/
├── domain/
│   ├── entities/
│   └── services/
├── infrastructure/
│   ├── models/
│   └── repositories/
└── presentation/
    ├── controllers/
    ├── routes/
    └── middleware/
```

2. Define entity in `domain/entities/`:
```javascript
class MyEntity {
  constructor(id, data) {
    this.id = id;
    this.data = data;
  }
}
```

3. Create repository in `infrastructure/repositories/`:
```javascript
class MyRepository {
  async save(entity) {
    return MyModel.create(entity);
  }
}
```

4. Create service in `application/services/`:
```javascript
class MyService {
  async process(data) {
    const entity = new MyEntity(id, data);
    return this.repo.save(entity);
  }
}
```

5. Create controller in `presentation/controllers/`:
```javascript
const myController = async (req, res) => {
  const result = await service.process(req.body);
  res.json({ success: true, data: result });
};
```

6. Add routes in `presentation/routes/`:
```javascript
router.post("/", myController);
```

---

## API Endpoints (Auth Module)

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---|---|---|
| POST | `/api/v1/auth/register` | ❌ | - | Register new user |
| POST | `/api/v1/auth/login` | ❌ | - | Login and get JWT token |
| GET | `/api/v1/auth/user-auth` | ✅ | - | Verify token is valid |
| POST | `/api/v1/auth/createTask` | ✅ | Admin | Create bulk tasks |
| GET | `/api/v1/auth/getTasks` | ✅ | Admin | Get all tasks |
| PATCH | `/api/v1/auth/task/:id/status` | ✅ | Admin | Update task status |
| GET | `/api/v1/auth/dashboard-stats` | ✅ | Admin | Get dashboard stats |

---

## Key Concepts

### **Round-Robin Scheduling**
Tasks are distributed fairly across workers in cyclic order.
- Located in: `Scheduler.js` and `AssignmentStrategy.js`
- Algorithm: Worker selection rotates through available workers

### **Task Queue**
In-memory queue for pending tasks with retry scheduling.
- Located in: `TaskQueue.js`
- Features: Batch processing, retry delays, size limits

### **Worker Processing**
Agents that execute assigned tasks with rate limiting.
- Located in: `Worker.js`
- Features: Task processing, retry logic, rate limiting (2 tasks/second)

### **Event Bus**
Global event emitter for asynchronous communication.
- Located in: `EventBus.js`
- Events: `taskAssigned`, `taskCompleted`

---

## Running Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Start production server
npm start

# Run tests (when tests are added)
npm test
```

---

## JSDoc Type Hints

Types are defined using JSDoc comments for IDE autocomplete:

```javascript
/**
 * @param {string} userId - User's unique identifier
 * @param {Object} data - User update data
 * @returns {Promise<Object>} Updated user object
 */
async function updateUser(userId, data) {
  return UserModel.findByIdAndUpdate(userId, data);
}
```

---

## Best Practices

### ✅ DO:
- Keep business logic in **Domain** layer (entities, services)
- Keep API handling in **Presentation** layer (controllers, routes)
- Use **Repository** pattern for data access
- Use **Service** layer to orchestrate operations
- Add JSDoc comments for all functions
- Use async/await for asynchronous operations

### ❌ DON'T:
- Mix business logic with API handling
- Access database directly from controllers
- Put domain logic in repository classes
- Hardcode configuration values
- Ignore error handling

---

## Debugging Tips

1. **Check module loading**:
   ```bash
   node -e "require('./src/modules/auth/presentation/controllers/authController.js')"
   ```

2. **Enable debug logs** (set in code):
   ```javascript
   console.log("Debug:", variable);
   ```

3. **Use Node inspector**:
   ```bash
   node --inspect src/app.js
   ```

4. **Check MongoDB connection**:
   - Verify `MONGO_URI` in `.env`
   - Test connection in DevTools or MongoDB Compass

---

## Environment Variables (.env)

```
PORT=8080
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key_here
DEV_MODE=development
```

---

## Further Reading

- **Express.js**: https://expressjs.com
- **Mongoose**: https://mongoosejs.com
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- **Repository Pattern**: https://martinfowler.com/eaaCatalog/repository.html

---

**Last Updated**: 2026-06-20  
**Version**: 1.0 (JavaScript)
