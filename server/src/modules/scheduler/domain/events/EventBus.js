const { EventEmitter } = require("events");

/**
 * Global event bus for domain events
 * Used for asynchronous communication between scheduler components
 * @type {EventEmitter}
 */
const eventBus = new EventEmitter();

module.exports = { eventBus };
