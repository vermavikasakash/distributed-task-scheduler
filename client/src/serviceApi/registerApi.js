import axiosInstance from "./axiosInstance";

//? REGISTER API
const registerFunction = async (payload) => {
  try {
    return await axiosInstance.post("/api/v1/auth/register", payload);
  } catch (error) {
    console.log(error);
    return error;
  }
};

//? LOGIN API
const loginFunction = async (payload) => {
  try {
    const res = await axiosInstance.post("/api/v1/auth/login", payload);

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//? AGENT CREATION API
const agentCreationFunction = async (payload) => {
  try {
    return await axiosInstance.post("/api/v1/auth/createAgent", payload);
  } catch (error) {
    console.log(error);
    return error;
  }
};

//? TASKS CREATION API
const taskCreationFunction = async (tasks) => {
  try {
    if (!tasks || tasks.length === 0) {
      console.warn("No tasks to post.");
      return;
    }

    return await axiosInstance.post("/api/v1/auth/createTask", {
      tasks,
    });
  } catch (error) {
    console.error("Error posting tasks:", error);

    return {
      status: error?.response?.status || 500,
      data: {
        message: error?.response?.data?.message || "Something went wrong",
      },
    };
  }
};

//? GET AGENT API
const getAgentsFunction = () => axiosInstance.get("/api/v1/auth/getAgents");

//? GET TASKS API
const getAllTasksFunction = () => axiosInstance.get("/api/v1/auth/getTasks");

//? GET TASKS API
const getAgentTasksFunction = () => axiosInstance.get("/api/v1/auth/myTasks");

//? GET Dashboard Stats API
const getDashboardStatsFunction = () =>
  axiosInstance.get("/api/v1/auth/dashboard-stats");

//! PATCH AGENT API
const patchAgentFunction = async (id) => {
  try {
    const res = await axiosInstance.patch(`/api/v1/auth/task/${id}/status`, {
      status: "completed",
    });

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export {
  registerFunction,
  loginFunction,
  agentCreationFunction,
  taskCreationFunction,
  getAgentsFunction,
  getAllTasksFunction,
  getAgentTasksFunction,
  getDashboardStatsFunction,
  patchAgentFunction,
};
