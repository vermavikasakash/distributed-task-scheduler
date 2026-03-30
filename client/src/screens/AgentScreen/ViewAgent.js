import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import {
  getAgentsFunction,
  getDashboardStatsFunction,
} from "../../serviceApi/registerApi";
import styles from "./AgentCreation.module.css";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/loader/Loader";

const ViewAgent = () => {
  const [agents, setAgents] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [statsResult, setStatsResult] = useState([]);
  const [loader, setLoader] = useState(false);

  const getAgents = async () => {
    setLoader(true);
    let result = await getAgentsFunction();
    let statsResult = await getDashboardStatsFunction();
    console.log("results", result);
    if (result?.status === 200) {
      setAgents(result?.data?.agent);
    }
    if (statsResult?.status === 200) {
      setStatsResult(statsResult?.data?.data);
    }
    setLoader(false);
  };

  useEffect(() => {
    getAgents();
  }, []);

  const sortedAgents = [...agents].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // ! JSX START

  return (
    <Layout>
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        Agent Management
      </h3>

      <Container>
        <table className={styles.table}>
          <thead>
            <tr>Total Agents: {statsResult?.totalAgents || 0}</tr>
          </thead>
          <thead>
            <tr className={styles.table_header}>
              <th onClick={handleSort} style={{ cursor: "pointer" }}>
                Agent Name {sortOrder === "asc" ? "⬆️" : "⬇️"}
              </th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created On</th>
            </tr>
          </thead>
          {loader ? (
            <tbody>
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <Loader />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {sortedAgents?.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.empty_state}>
                    👤 No agents available. Add agents to get started
                  </td>
                </tr>
              ) : (
                sortedAgents.map((data, i) => (
                  <tr
                    key={i}
                    className={
                      i % 2 === 0 ? styles.details_row : styles.details_row2
                    }
                  >
                    <td>{data?.name}</td>
                    <td>{data?.email}</td>
                    <td>{data?.phone || "-"}</td>
                    <td>{new Date(data?.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </Container>
    </Layout>
  );
};

export default ViewAgent;
