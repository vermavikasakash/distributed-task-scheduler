"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const EventBus_1 = require("../events/EventBus");
const AssignmentStrategy_1 = require("./AssignmentStrategy");
class Scheduler {
    constructor(queue, workers) {
        this.queue = queue;
        this.workers = workers;
        this.strategy = new AssignmentStrategy_1.RoundRobinStrategy();
        this.intervalId = null;
    }
    getNextAvailableWorker(task) {
        const attempts = this.workers.length;
        for (let i = 0; i < attempts; i++) {
            const worker = this.strategy.assign(this.workers);
            if (!worker.isBusy && worker.id !== task.lastWorkerId) {
                return worker;
            }
        }
        return null;
    }
    schedule() {
        if (this.intervalId) {
            return;
        }
        this.intervalId = setInterval(() => this.run(), 100);
    }
    run() {
        if (this.queue.isEmpty()) {
            return;
        }
        const tasks = this.queue.dequeueBatch(1);
        if (tasks.length === 0) {
            return;
        }
        const task = tasks[0];
        const worker = this.getNextAvailableWorker(task);
        if (!worker) {
            this.queue.enqueue(task);
            return;
        }
        task.assign();
        console.log("Assigned:", task.id, "to", worker.id);
        EventBus_1.eventBus.emit("taskAssigned", {
            task,
            workerId: worker.id,
        });
    }
}
exports.Scheduler = Scheduler;
