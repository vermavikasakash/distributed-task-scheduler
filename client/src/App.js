import { Routes, Route } from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";
import PageNotFound from "./screens/PageNotFound/PageNotFound";
import Login from "./screens/Login/Login/Login";
import AgentCreation from "./screens/AgentScreen/AgentCreation";
import ViewAgent from "./screens/AgentScreen/ViewAgent";
import TaskCreation from "./screens/Tasks/TasksCreation";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/create-agent" element={<AgentCreation />} />
        <Route path="/create-task" element={<TaskCreation />} />
        <Route path="/view-agent" element={<ViewAgent />} />
        {/* <Route path="/view-task" element={<ViewTask />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
