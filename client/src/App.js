import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";
import PageNotFound from "./screens/PageNotFound/PageNotFound";
import TaskCreation from "./screens/Tasks/TasksCreation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home-page" element={<Navigate to="/" replace />} />
      <Route path="/create-task" element={<TaskCreation />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
