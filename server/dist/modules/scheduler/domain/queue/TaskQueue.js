"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueue = void 0;
class TaskQueue {
    constructor() {
        this.queue = [];
    }
    enqueue(task) {
        this.queue.push(task);
    }
    enqueueBulk(tasks) {
        this.queue.push(...tasks);
    }
    dequeueBatch(size) {
        const now = Date.now();
        const selected = [];
        const remaining = [];
        for (const task of this.queue) {
            if (selected.length < size &&
                (!task.nextRetryAt || task.nextRetryAt <= now)) {
                selected.push(task);
            }
            else {
                remaining.push(task);
            }
        }
        this.queue = remaining;
        return selected;
    }
    isEmpty() {
        return this.queue.length === 0;
    }
    getPendingCount() {
        return this.queue.length;
    }
}
exports.TaskQueue = TaskQueue;
