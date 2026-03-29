import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  getAllTasksFunction,
  getAgentTasksFunction,
  getDashboardStatsFunction,
  patchAgentFunction,
} from "../../serviceApi/registerApi";
import styles from "../AgentScreen/AgentCreation.module.css";

const ViewTask = () => {
  const [task, setTask] = useState([]);
  const [statsResult, setStatsResult] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  let role = sessionStorage.getItem("role");

  const getTasks = async () => {
    let result;
    if (role == 1) {
      result = await getAllTasksFunction();
    } else {
      result = await getAgentTasksFunction();
    }

    let statsResult = await getDashboardStatsFunction();
    console.log("statsResult", statsResult);
    console.log("results", result);
    if (result?.status == 200) {
      setTask(result?.data?.task);
    }
    if (statsResult?.status == 200) {
      setStatsResult(statsResult?.data?.data);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // ? HANDLE COMPLETE TASK
  const handleComplete = async (id) => {
    const res = await patchAgentFunction(id);
    if (res?.status == 200) {
      getTasks();
    }
  };

  const sortedTasks = [...task].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.agentName.localeCompare(b.agentName);
    } else {
      return b.agentName.localeCompare(a.agentName);
    }
  });

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // ! JSX START

  return (
    <>
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>Task Dashboard</h3>
      <h6 style={{ textAlign: "center" }}>
        Manage and monitor task assignments
      </h6>

      <Container>
        {/* TABLE */}
        <table className={styles.table}>
          <thead>
            <tr>
              Total Tasks: {statsResult?.totalTasks || 0} &nbsp; &nbsp;
              {role == 1 && `| Total Agents: ${statsResult?.totalAgents || 0}`}
            </tr>
          </thead>
          <thead>
            <tr className={styles.table_header}>
              <th>Name</th>
              <th>Phone</th>
              <th>Task Description</th>
              <th>Task Status</th>
              <th onClick={handleSort} style={{ cursor: "pointer" }}>
                Assigned Agent {sortOrder === "asc" ? "⬆️" : "⬇️"}
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedTasks?.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.empty_state}>
                  📭 No tasks available yet. Upload tasks to begin assignment
                </td>
              </tr>
            ) : (
              sortedTasks.map((data, i) => (
                <tr
                  key={i}
                  className={
                    i % 2 === 0 ? styles.details_row : styles.details_row2
                  }
                >
                  <td>{data?.firstName}</td>
                  <td>{data?.phone || "-"}</td>
                  <td>{data?.notes}</td>
                  <td>
                    {data?.status === "completed" ? (
                      <span
                        style={{
                          backgroundColor: "#d4edda",
                          color: "#155724",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        Done
                      </span>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: "#fff3cd",
                            color: "#856404",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        >
                          Pending
                        </span>

                        {role != 1 && (
                          <button
                            onClick={() => handleComplete(data._id)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#198754",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td>{data?.agentName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Container>
    </>
  );
};

export default ViewTask;
