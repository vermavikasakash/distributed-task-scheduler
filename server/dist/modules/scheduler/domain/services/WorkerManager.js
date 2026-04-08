"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerManager = void 0;
const Worker_1 = require("../entities/Worker");
const WorkerRunner_1 = require("./WorkerRunner");
class WorkerManager {
    constructor(taskQueue, taskStore) {
        this.taskQueue = taskQueue;
        this.taskStore = taskStore;
        this.workers = [];
        this.runners = [];
        this.MIN_WORKERS = 1;
        this.MAX_WORKERS = 10;
    }
    start(initialWorkers = 2) {
        for (let i = 0; i < initialWorkers; i++) {
            this.addWorker();
        }
    }
    addWorker() {
        if (this.workers.length >= this.MAX_WORKERS) {
            return;
        }
        const worker = new Worker_1.Worker(`worker-${Date.now()}-${Math.random()}`, this.taskStore);
        const runner = new WorkerRunner_1.WorkerRunner(worker, this.taskQueue);
        this.workers.push(worker);
        this.runners.push(runner);
        console.log("Worker added:", worker.id);
    }
    removeWorker() {
        if (this.workers.length <= this.MIN_WORKERS) {
            return;
        }
        const worker = this.workers.pop();
        this.runners.pop();
        console.log("Worker removed:", worker === null || worker === void 0 ? void 0 : worker.id);
    }
    getWorkerCount() {
        return this.workers.length;
    }
    getIdleWorker() {
        return this.workers.find((worker) => !worker.isBusy) || null;
    }
}
exports.WorkerManager = WorkerManager;
