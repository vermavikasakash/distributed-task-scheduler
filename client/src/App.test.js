import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

jest.mock("./serviceApi/taskApi", () => ({
  getAllTasksFunction: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: { task: [] },
    }),
  ),
  getDashboardStatsFunction: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: { data: { totalTasks: 0 } },
    }),
  ),
}));

test("renders the scheduler dashboard by default", async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  expect(
    await screen.findByRole("heading", { name: /publish tasks/i }),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/no tasks available yet/i),
  ).toBeInTheDocument();
});
