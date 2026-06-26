import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import Layout from "../../components/Layout/Layout";
import Task_Template from "../../components/Task_Template.xls";
import {
  getDashboardStatsFunction,
  taskCreationFunction,
} from "../../serviceApi/taskApi";
import styles from "../../styles/TaskScheduler.module.css";

const TaskCreation = () => {
  const [task, setTask] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [statsResult, setStatsResult] = useState({});

  const navigate = useNavigate();

  const getStats = async () => {
    const statsResponse = await getDashboardStatsFunction();

    if (statsResponse?.status === 200) {
      setStatsResult(statsResponse?.data?.data || {});
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  const readExcel = (file) => {
    setFileName(file.name);

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const workbook = XLSX.read(bufferArray, { type: "buffer" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const parsedRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      setTask(parsedRows);
    };

    fileReader.onerror = () => {
      toast.error("Error reading file");
    };
  };

  const uploadHandler = async () => {
    if (task.length === 0) {
      toast.error("No valid tasks found");
      return;
    }

    const requiredKeys = ["firstName", "phone", "notes"];
    const isValidFile = task.every((row) =>
      requiredKeys.every((key) => String(row?.[key] || "").trim()),
    );

    if (!isValidFile) {
      toast.error("Invalid file format. Use columns: firstName, phone, notes.");
      return;
    }

    setLoading(true);

    const normalizedTasks = task.map(({ firstName, phone, notes }) => ({
      firstName: String(firstName).trim(),
      phone: String(phone).trim(),
      notes: String(notes).trim(),
    }));

    const result = await taskCreationFunction(normalizedTasks);

    if (result?.status === 202) {
      toast.info("Tasks are being processed in the background");
      setTask([]);
      setFileName("");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      toast.error(result?.data?.message || "Upload failed");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <section className={styles.pageIntro}>
        <p className={styles.eyebrow}>Batch Import</p>
        <h1 className={styles.pageTitle}>Upload Tasks</h1>
        <p className={styles.pageSubtitle}>
          Import spreadsheet rows into the scheduler queue. The backend workers
          will process each task asynchronously and update the dashboard.
        </p>
      </section>

      <div className={styles.tabDiv}>
        <Button variant="outline-success" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>

      <Container className={styles.uploadPanel}>
        <div className={styles.uploadToolbar}>
          <Button
            as="a"
            href={Task_Template}
            download="Task_Template.xls"
            variant="dark"
          >
            Download Excel Template
          </Button>

          <span className={styles.metaText}>
            Current recorded tasks: {statsResult?.totalTasks || 0}
          </span>
        </div>

        <Row className={styles.uploadFileDiv}>
          <label className={styles.uploadFileText}>
            Upload Excel file (.xlsx, .xls, .csv)
          </label>

          <Col md={5}>
            <input
              className={styles.fileInput}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => {
                const file = e.target.files[0];

                if (!file) {
                  return;
                }

                const allowedExtensions = ["xlsx", "xls", "csv"];
                const extension = file.name.split(".").pop().toLowerCase();

                if (!allowedExtensions.includes(extension)) {
                  toast.error("Invalid file type");
                  return;
                }

                readExcel(file);
              }}
            />
          </Col>

          <Col>
            <Button
              variant="success"
              disabled={task.length === 0 || loading}
              onClick={uploadHandler}
            >
              {loading ? "Uploading..." : "Upload Tasks"}
            </Button>
          </Col>
        </Row>

        {fileName && <p className={styles.metaText}>Selected file: {fileName}</p>}
        {task.length > 0 && (
          <p className={styles.metaText}>Total tasks parsed: {task.length}</p>
        )}

        <Table hover size="sm" className="mt-4">
          <thead className={styles.tableHeader}>
            <tr>
              <th>S. No.</th>
              <th>First Name</th>
              <th>Phone</th>
              <th>Task Description</th>
            </tr>
          </thead>

          <tbody>
            {task.length > 0 ? (
              task.map((data, index) => (
                <tr
                  key={`${data?.SNo || index}-${data?.phone || index}`}
                  className={
                    index % 2 === 0 ? styles.detailsRow : styles.detailsRowAlt
                  }
                >
                  <td>{data?.SNo || index + 1}</td>
                  <td>{data?.firstName}</td>
                  <td>{data?.phone}</td>
                  <td>{data?.notes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles.noUser}>
                  No tasks parsed yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <p className={styles.metaText} style={{ marginTop: "14px" }}>
          Tasks are queued in RabbitMQ and processed by separate worker
          processes.
        </p>
      </Container>
    </Layout>
  );
};

export default TaskCreation;
