"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundRobinStrategy = void 0;
class RoundRobinStrategy {
    constructor() {
        this.index = 0;
    }
    assign(workers) {
        const worker = workers[this.index];
        this.index = (this.index + 1) % workers.length;
        return worker;
    }
}
exports.RoundRobinStrategy = RoundRobinStrategy;
