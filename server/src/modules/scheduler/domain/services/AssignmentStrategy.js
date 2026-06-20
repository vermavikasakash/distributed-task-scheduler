/**
 * RoundRobinStrategy - Fair task assignment algorithm
 * Distributes tasks evenly across all workers in cyclic order
 */
class RoundRobinStrategy {
  constructor() {
    this.index = 0;
  }

  /**
   * Select next worker in round-robin fashion
   * @param {Array} workers - Array of available workers
   * @returns {Object} Next worker in rotation
   */
  assign(workers) {
    const worker = workers[this.index];
    this.index = (this.index + 1) % workers.length;
    return worker;
  }
}

module.exports = { RoundRobinStrategy };
