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

    return await axiosInstance.post("/api/v1/tasks", {
      tasks,
    });
  } catch (error) {
    return getErrorResponse(error, "Something went wrong while uploading tasks");
  }
};

const getAllTasksFunction = async () => {
  try {
    return await axiosInstance.get("/api/v1/tasks");
  } catch (error) {
    return getErrorResponse(error, "Unable to fetch tasks");
  }
};

const getDashboardStatsFunction = async () => {
  try {
    return await axiosInstance.get("/api/v1/tasks/dashboard-stats");
  } catch (error) {
    return getErrorResponse(error, "Unable to fetch dashboard stats");
  }
};

export {
  taskCreationFunction,
  getAllTasksFunction,
  getDashboardStatsFunction,
};
