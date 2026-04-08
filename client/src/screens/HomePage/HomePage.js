import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import ViewTask from "../Tasks/ViewTask";
import styles from "../../styles/TaskScheduler.module.css";

const HomePage = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const adminName = user?.name || "Admin";

  return (
    <Layout>
      <section className={styles.pageIntro}>
        <p className={styles.eyebrow}>Admin Workspace</p>
        <h1 className={styles.pageTitle}>
          Queue tasks quickly and keep an eye on worker outcomes.
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
            <span className={styles.actionCardTitle}>Signed in as {adminName}</span>
            <span className={styles.actionCardDescription}>
              Background workers process tasks asynchronously, so statuses update
              after upload without any separate agent dashboard.
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
