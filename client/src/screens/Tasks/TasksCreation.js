import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Task_Template from "../../components/Task_Template.xls";
import styles from "../AgentScreen/AgentCreation.module.css";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import {
  getDashboardStatsFunction,
  taskCreationFunction,
} from "../../serviceApi/registerApi";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TaskCreation = () => {
  const [task, setTask] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [statsResult, setStatsResult] = useState([]);

  const navigate = useNavigate();

  const getAgents = async () => {
    let statsResult = await getDashboardStatsFunction();
    if (statsResult?.status === 200) {
      setStatsResult(statsResult?.data?.data);
    }
  };

  useEffect(() => {
    getAgents();
  }, []);

  // ? READ EXCEL
  const readExcel = (file) => {
    setFileName(file.name);

    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const wb = XLSX.read(bufferArray, { type: "buffer" });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];

      const data = XLSX.utils.sheet_to_json(ws);

      setTask(data);
    };

    fileReader.onerror = () => {
      toast.error("Error reading file");
    };
  };

  //? UPLOAD HANDLER
  const uploadHandler = async () => {
    if (task.length === 0) {
      toast.error("No valid tasks found!");
      return;
    }

    const requiredKeys = ["SNo", "firstName", "phone", "notes"];

    const isValidFile = requiredKeys.every((key) => key in task[0]);

    if (!isValidFile) {
      toast.error("Invalid file format! Use correct template.");
      return;
    }

    try {
      setLoading(true);

      const result = await taskCreationFunction(task);

      if (result?.status === 202) {
       toast.info("Tasks are being processed in background");
        setTask([]);
        setFileName("");
        setTimeout(() => {
          navigate("/home-page");
        }, 3000);
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("No agents available. Please add agents first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>Upload Tasks</h3>
      <h6 style={{ textAlign: "center" }}>Bulk upload tasks using Excel</h6>

      <Container>
        {/* TEMPLATE DOWNLOAD */}
        <Button variant="dark" className="mb-3">
          <a href={Task_Template} download="Task_Template">
            ⬇️ Download Excel Template
          </a>
        </Button>

        {/* FILE UPLOAD */}
        <Row className={styles.uploadFileDiv}>
          <label className={styles.uploadFileText}>
            Upload Excel file (.xlsx)
          </label>

          <Col md={4}>
            <input
              className={styles.fileInput}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => {
                const file = e.target.files[0];

                if (!file) return;

                const allowedExtensions = ["xlsx", "xls", "csv"];
                const ext = file.name.split(".").pop().toLowerCase();

                if (!allowedExtensions.includes(ext)) {
                  toast.error("Invalid file type!");
                  return;
                }

                readExcel(file);
              }}
            />
          </Col>

          <Col>
            <Button
              variant="success"
              disabled={
                statsResult?.totalAgents === 0 || task.length === 0 || loading
              }
              onClick={uploadHandler}
            >
              {loading ? "Uploading..." : "Upload Task"}
            </Button>
          </Col>
        </Row>
        {statsResult?.totalAgents === 0 && (
          <p style={{ marginTop: "10px", fontSize: "14px", color: "red" }}>
            No agents available. Please add agents first.
          </p>
        )}

        {/* FILE NAME */}
        {fileName && (
          <p style={{ marginTop: "10px" }}>📄 Selected file: {fileName}</p>
        )}

        {/* TASK COUNT */}
        {task.length > 0 && (
          <p style={{ marginTop: "10px" }}>Total Tasks Parsed: {task.length}</p>
        )}

        {/* TABLE */}
        <Table hover size="sm" className="mt-4">
          <thead className={styles.tableHeading}>
            <tr>
              <th>S. No.</th>
              <th>First Name</th>
              <th>Phone</th>
              <th>Task Description</th>
            </tr>
          </thead>

          <tbody className={styles.tableBody}>
            {task.length > 0 ? (
              task.map((data, i) => (
                <tr key={i}>
                  <td>{data?.SNo}</td>
                  <td>{data?.firstName}</td>
                  <td>{data?.phone}</td>
                  <td>{data?.notes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles.noUser}>
                  📭 No Tasks Available
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* SYSTEM INFO (VERY STRONG SIGNAL) */}
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
          Tasks will be automatically assigned using round-robin scheduling
        </p>
      </Container>
    </Layout>
  );
};

export default TaskCreation;
