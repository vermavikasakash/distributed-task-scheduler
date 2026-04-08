"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerRunner = void 0;
const enums_1 = require("../../../../shared/enums/enums");
const Worker_1 = require("../entities/Worker");
const EventBus_1 = require("../events/EventBus");
class WorkerRunner {
    constructor(worker, taskQueue) {
        this.worker = worker;
        this.taskQueue = taskQueue;
        this.listen();
    }
    listen() {
        EventBus_1.eventBus.on("taskAssigned", async ({ task, workerId }) => {
            if (workerId !== this.worker.id) {
                return;
            }
            if (this.worker.isBusy) {
                return;
            }
            console.log(`Worker ${this.worker.id} processing:`, task.id);
            try {
                const result = await this.worker.process(task);
                if (result === Worker_1.WorkerProcessResult.REQUEUED) {
                    console.log("Re-enqueue (retry or rate limit):", task.id);
                    this.taskQueue.enqueue(task);
                }
                else if (result === Worker_1.WorkerProcessResult.FAILED) {
                    console.log("Failed permanently:", task.id);
                }
                else {
                    console.log("Completed:", task.id);
                }
            }
            catch (error) {
                console.error(`Worker ${this.worker.id} crashed while processing ${task.id}:`, error);
                task.retry();
                if (task.status === enums_1.TaskStatus.RETRY) {
                    console.log("Re-enqueue (unexpected crash):", task.id);
                    this.taskQueue.enqueue(task);
                }
                else {
                    console.log("Failed permanently:", task.id);
                }
            }
            finally {
                EventBus_1.eventBus.emit("taskCompleted");
            }
        });
    }
}
exports.WorkerRunner = WorkerRunner;
