const { getNextBatch } = require("./queueService");
const { Task, User, AssignmentState } = require("../models/userModel");

const assignTasksToAgents = async () => {
  try {
    const batch = getNextBatch(5); // process 5 at a time

    if (!batch.length) return;

    const agents = await User.find({role: 0}); // get all agents

    if (!agents.length) return;

    let state = await AssignmentState.findOne();

    if (!state) {
      state = await AssignmentState.create({});
    }

    let currentIndex = state.lastAssignedAgentIndex;

    const tasksWithAssignment = batch.map((task) => {
      currentIndex = (currentIndex + 1) % agents.length;

      const agent = agents[currentIndex];

      return {
        ...task,
        agentId: agent._id,
        agentName: agent.name,
      };
    });

    await Task.insertMany(tasksWithAssignment);

    state.lastAssignedAgentIndex = currentIndex;
    await state.save();

    console.log(`Processed ${tasksWithAssignment.length} tasks`);
  } catch (err) {
    console.error("Worker error:", err);
  }
};

setInterval(assignTasksToAgents, 200); // runs every 200ms
