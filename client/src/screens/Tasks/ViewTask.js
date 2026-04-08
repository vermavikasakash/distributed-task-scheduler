import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllTasksFunction,
  getDashboardStatsFunction,
} from "../../serviceApi/registerApi";
import Loader from "../../components/loader/Loader";
import styles from "../../styles/TaskScheduler.module.css";

const ViewTask = () => {
  const [task, setTask] = useState([]);
  const [statsResult, setStatsResult] = useState({});
  const [sortOrder, setSortOrder] = useState("desc");
  const [loader, setLoader] = useState(false);

  const getTasks = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setLoader(true);
    }

    const [taskResponse, statsResponse] = await Promise.all([
      getAllTasksFunction(),
      getDashboardStatsFunction(),
    ]);

    if (taskResponse?.status === 200) {
      setTask(taskResponse?.data?.task || []);
    }

    if (statsResponse?.status === 200) {
      setStatsResult(statsResponse?.data?.data || {});
    }

    if (showLoader) {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    getTasks(true);

    const intervalId = setInterval(() => {
      getTasks(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [getTasks]);

  const sortedTasks = useMemo(
    () =>
      [...task].sort((a, b) => {
        const firstDate = new Date(a?.createdAt || 0).getTime();
        const secondDate = new Date(b?.createdAt || 0).getTime();

        return sortOrder === "asc"
          ? firstDate - secondDate
          : secondDate - firstDate;
      }),
    [sortOrder, task],
  );

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

  const getStatusClassName = (status) => {
    if (status === "completed") {
      return styles.statusCompleted;
    }

    if (status === "failed") {
      return styles.statusFailed;
    }

    return styles.statusPending;
  };

  return (
    <>
      <section className={styles.dashboardIntro}>
        <h2 className={styles.sectionTitle}>Task Dashboard</h2>
        <p className={styles.pageSubtitle}>
          New uploads are queued immediately. This table refreshes every 5
          seconds so you can watch completed and failed jobs settle over time.
        </p>
      </section>

      <div className={styles.summaryBar}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Recorded Tasks</span>
          <strong className={styles.summaryValue}>
            {statsResult?.totalTasks ?? task.length}
          </strong>
        </div>

        <button
          type="button"
          className={styles.sortButton}
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          Sort by {sortOrder === "desc" ? "newest" : "oldest"} first
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>Name</th>
              <th>Phone</th>
              <th>Task Description</th>
              <th>Status</th>
              <th>Retries</th>
              <th>Internal State</th>
              <th>Created On</th>
            </tr>
          </thead>

          {loader ? (
            <tbody>
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                  <Loader />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>
                    No tasks available yet. Upload a batch to start the scheduler.
                  </td>
                </tr>
              ) : (
                sortedTasks.map((data, index) => (
                  <tr
                    key={data?._id || data?.taskId || index}
                    className={
                      index % 2 === 0 ? styles.detailsRow : styles.detailsRowAlt
                    }
                  >
                    <td>{data?.firstName || "-"}</td>
                    <td>{data?.phone || "-"}</td>
                    <td>{data?.notes || "-"}</td>
                    <td>
                      <span
                        className={`${styles.statusPill} ${getStatusClassName(data?.status)}`}
                      >
                        {data?.status || "pending"}
                      </span>
                    </td>
                    <td>{data?.retryCount ?? 0}</td>
                    <td>{data?.internalStatus || "-"}</td>
                    <td>{formatDate(data?.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};

export default ViewTask;
