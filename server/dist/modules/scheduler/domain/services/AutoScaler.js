"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoScaler = void 0;
class AutoScaler {
    constructor(manager, queue) {
        this.manager = manager;
        this.queue = queue;
        this.HIGH_THRESHOLD = 3;
        this.LOW_THRESHOLD = 1;
    }
    start() {
        setInterval(() => {
            const pendingTasks = this.queue.getPendingCount();
            const workers = this.manager.getWorkerCount();
            console.log(`Tasks: ${pendingTasks}, Workers: ${workers}`);
            const effectiveWorkers = workers || 1;
            if (pendingTasks > effectiveWorkers * this.HIGH_THRESHOLD) {
                this.manager.addWorker();
            }
            else if (pendingTasks < workers && workers > 1) {
                this.manager.removeWorker();
            }
        }, 3000);
    }
}
exports.AutoScaler = AutoScaler;
