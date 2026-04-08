"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerStatus = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["QUEUED"] = "QUEUED";
    TaskStatus["ASSIGNED"] = "ASSIGNED";
    TaskStatus["PROCESSING"] = "PROCESSING";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["FAILED"] = "FAILED";
    TaskStatus["RETRY"] = "RETRY";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var WorkerStatus;
(function (WorkerStatus) {
    WorkerStatus["IDLE"] = "IDLE";
    WorkerStatus["BUSY"] = "BUSY";
})(WorkerStatus || (exports.WorkerStatus = WorkerStatus = {}));
