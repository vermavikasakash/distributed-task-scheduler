import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";
import PageNotFound from "./screens/PageNotFound/PageNotFound";
import Login from "./screens/Login/Login/Login";
import TaskCreation from "./screens/Tasks/TasksCreation";

const ProtectedRoutes = () => {
  const token = sessionStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

const LandingRoute = () => {
  const token = sessionStorage.getItem("token");

  return token ? <Navigate to="/home-page" replace /> : <Login />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/create-task" element={<TaskCreation />} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/home-page" replace />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
