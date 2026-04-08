import axiosInstance from "./axiosInstance";

const getErrorResponse = (error, fallbackMessage) => {
  console.error(error);

  return (
    error?.response || {
      status: 500,
      data: {
        message: fallbackMessage,
      },
    }
  );
};

const loginFunction = async (payload) => {
  try {
    return await axiosInstance.post("/api/v1/auth/login", payload);
  } catch (error) {
    return getErrorResponse(error, "Unable to sign in");
  }
};

const taskCreationFunction = async (tasks) => {
  try {
    if (!tasks || tasks.length === 0) {
      return {
        status: 400,
        data: {
          message: "No tasks provided",
        },
      };
    }

    return await axiosInstance.post("/api/v1/auth/createTask", {
      tasks,
    });
  } catch (error) {
    return getErrorResponse(error, "Something went wrong while uploading tasks");
  }
};

const getAllTasksFunction = async () => {
  try {
    return await axiosInstance.get("/api/v1/auth/getTasks");
  } catch (error) {
    return getErrorResponse(error, "Unable to fetch tasks");
  }
};

const getDashboardStatsFunction = async () => {
  try {
    return await axiosInstance.get("/api/v1/auth/dashboard-stats");
  } catch (error) {
    return getErrorResponse(error, "Unable to fetch dashboard stats");
  }
};

export {
  loginFunction,
  taskCreationFunction,
  getAllTasksFunction,
  getDashboardStatsFunction,
};
