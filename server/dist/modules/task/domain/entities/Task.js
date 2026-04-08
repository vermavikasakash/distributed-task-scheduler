"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const enums_1 = require("../../../../shared/enums/enums");
class Task {
    constructor(id, payload) {
        this.id = id;
        this.payload = payload;
        this.status = enums_1.TaskStatus.QUEUED;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.nextRetryAt = 0;
    }
    queue() {
        this.status = enums_1.TaskStatus.QUEUED;
    }
    assign() {
        this.status = enums_1.TaskStatus.ASSIGNED;
    }
    start() {
        this.status = enums_1.TaskStatus.PROCESSING;
    }
    complete() {
        this.status = enums_1.TaskStatus.COMPLETED;
    }
    retry() {
        this.retryCount++;
        if (this.retryCount >= this.maxRetries) {
            this.status = enums_1.TaskStatus.FAILED;
        }
        else {
            this.status = enums_1.TaskStatus.RETRY;
            const delay = 1000 * Math.pow(2, this.retryCount);
            this.nextRetryAt = Date.now() + delay;
        }
    }
}
exports.Task = Task;
