import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllTasksFunction,
  getDashboardStatsFunction,
} from "../../serviceApi/taskApi";
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

    const intervalId = setInterval (() => {
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
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "completed") {
      return styles.statusCompleted;
    }

    if (normalizedStatus === "failed") {
      return styles.statusFailed;
    }

    if (normalizedStatus === "processing") {
      return styles.statusProcessing;
    }

    if (normalizedStatus === "retry") {
      return styles.statusRetry;
    }

    return styles.statusQueued;
  };

  return (
    <>
      <section className={styles.dashboardIntro}>
        <h2 className={styles.sectionTitle}>Task Dashboard</h2>
        <p className={styles.pageSubtitle}>
          New uploads are queued immediately. This table refreshes every 5
          seconds so you can watch queued, processing, retrying, completed, and
          failed jobs settle over time.
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
              <th>Current Status</th>
              <th>Retries</th>
              <th>Created On</th>
            </tr>
          </thead>

          {loader ? (
            <tbody>
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                  <Loader />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyState}>
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
                        {data?.status}
                      </span>
                    </td>
                    <td>{data?.retryCount ?? 0}</td>
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
