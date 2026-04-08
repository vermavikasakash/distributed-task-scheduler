"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = exports.WorkerProcessResult = void 0;
const enums_1 = require("../../../../shared/enums/enums");
var WorkerProcessResult;
(function (WorkerProcessResult) {
    WorkerProcessResult["REQUEUED"] = "REQUEUED";
    WorkerProcessResult["COMPLETED"] = "COMPLETED";
    WorkerProcessResult["FAILED"] = "FAILED";
})(WorkerProcessResult || (exports.WorkerProcessResult = WorkerProcessResult = {}));
class Worker {
    constructor(id, taskStore) {
        this.id = id;
        this.taskStore = taskStore;
        this.isBusy = false;
        this.processedCount = 0;
        this.windowStart = Date.now();
        this.RATE_LIMIT = 2;
        this.WINDOW_SIZE = 1000;
    }
    canProcess() {
        const now = Date.now();
        if (now - this.windowStart >= this.WINDOW_SIZE) {
            this.windowStart = now;
            this.processedCount = 0;
        }
        return this.processedCount < this.RATE_LIMIT;
    }
    getRetryOutcome(task) {
        return task.status === enums_1.TaskStatus.FAILED
            ? WorkerProcessResult.FAILED
            : WorkerProcessResult.REQUEUED;
    }
    async persistTaskState(task) {
        try {
            await this.taskStore.createTaskRecord(task);
        }
        catch (error) {
            console.error("Error saving task record:", error);
        }
    }
    async process(task) {
        task.lastWorkerId = this.id;
        if (!this.canProcess()) {
            console.log(`Worker ${this.id} rate limited`);
            task.retry();
            await this.persistTaskState(task);
            const result = this.getRetryOutcome(task);
            return result;
        }
        this.processedCount++;
        this.isBusy = true;
        task.start();
        await this.persistTaskState(task);
        try {
            if (Math.random() < 0.7) {
                throw new Error("Random failure");
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            task.complete();
            await this.persistTaskState(task);
            return WorkerProcessResult.COMPLETED;
        }
        catch (err) {
            console.log("Failed to process task", task.id);
            task.retry();
            await this.persistTaskState(task);
            const result = this.getRetryOutcome(task);
            return result;
        }
        finally {
            this.isBusy = false;
        }
    }
}
exports.Worker = Worker;
