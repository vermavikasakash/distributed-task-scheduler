let taskQueue = [];

function addTasks(tasks) {
  taskQueue.push(...tasks);
}

function getNextBatch(size = 10) {
  return taskQueue.splice(0, size);
}

module.exports = { addTasks, getNextBatch };