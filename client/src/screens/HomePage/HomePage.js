import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import ViewTask from "../Tasks/ViewTask";
import styles from "../../styles/TaskScheduler.module.css";

const HomePage = () => {
  return (
    <Layout>
      <section className={styles.pageIntro}>
        <p className={styles.eyebrow}>Scheduler Workspace</p>
        <h1 className={styles.pageTitle}>
          Publish tasks, watch RabbitMQ route them, and track worker outcomes.
        </h1>
       

        <div className={styles.actionRow}>
          <Link to="/create-task" className={styles.actionCard}>
            <span className={styles.actionCardTitle}>Upload a new task batch</span>
            <span className={styles.actionCardDescription}>
              Import an Excel or CSV file and push records into the scheduler
              queue.
            </span>
          </Link>

          <div className={styles.infoCard}>
            <span className={styles.actionCardTitle}>Queue-driven processing</span>
            <span className={styles.actionCardDescription}>
              The API publishes each task to RabbitMQ. Workers consume messages,
              update MongoDB, and failed jobs wait in the retry queue before
              returning to the tasks queue.
            </span>
          </div>
        </div>
      </section>

      <div className={styles.tabDiv}>
        <span className={styles.activeTab}>Task Dashboard</span>
        <Link to="/create-task" className={styles.tabLink}>
          Upload Tasks
        </Link>
      </div>

      <ViewTask />
    </Layout>
  );
};

export default HomePage;
