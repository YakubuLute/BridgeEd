import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GradeLevel, type ClassRecord } from "@bridgeed/shared";
import type { ReactNode } from "react";

import { bridgeEdTheme } from "../../../styles/theme";
import { ClassLearnersPage } from "./ClassLearnersPage";

const mockUseClassesQuery = vi.fn();
const mockUseClassLearnersQuery = vi.fn();
const mockUseCreateLearnerMutation = vi.fn();
const mockUseBatchCreateLearnersMutation = vi.fn();

vi.mock("../../../api/hooks/useClassQueries", () => ({
  useClassesQuery: () => mockUseClassesQuery(),
  useClassLearnersQuery: (classId: string) => mockUseClassLearnersQuery(classId)
}));

vi.mock("../../../api/hooks/useLearnerQueries", () => ({
  useCreateLearnerMutation: (classId: string, options: unknown) =>
    mockUseCreateLearnerMutation(classId, options),
  useBatchCreateLearnersMutation: (classId: string, options: unknown) =>
    mockUseBatchCreateLearnersMutation(classId, options)
}));

vi.mock("../components/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

const defaultClass: ClassRecord = {
  id: "1",
  classId: "class-1",
  schoolId: "school-demo-001",
  teacherId: "teacher-1",
  name: "JHS 1A",
  gradeLevel: GradeLevel.JHS1,
  subject: "Math",
  academicYear: "2025/2026",
  isActive: true,
  createdAt: new Date("2026-03-01T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-03-01T00:00:00.000Z").toISOString()
};

const renderPage = (): void => {
  render(
    <MantineProvider theme={bridgeEdTheme} defaultColorScheme="light">
      <MemoryRouter initialEntries={["/classes/class-1"]}>
        <Routes>
          <Route element={<ClassLearnersPage />} path="/classes/:classId" />
        </Routes>
      </MemoryRouter>
    </MantineProvider>
  );
};

describe("ClassLearnersPage CSV flow", () => {
  beforeEach(() => {
    mockUseClassesQuery.mockReturnValue({
      data: [defaultClass],
      isLoading: false,
      isError: false
    });
    mockUseClassLearnersQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false
    });
    mockUseCreateLearnerMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false
    });
    mockUseBatchCreateLearnersMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false
    });
  });

  it("shows CSV preview and disables import when no valid rows", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("tab", { name: "CSV Import" }));
    const csvInput = document.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["name,gradeLevel\nAma,INVALID"], "learners.csv", {
      type: "text/csv"
    });

    fireEvent.change(csvInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("0 valid")).toBeInTheDocument();
      expect(screen.getByText("1 invalid")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Import Valid Rows" })).toBeDisabled();
  });

  it("parses valid and invalid rows from CSV", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("tab", { name: "CSV Import" }));
    const csvInput = document.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["name,gradeLevel\nAkua Asante,JHS1\nKofi Owusu,INVALID"], "learners.csv", {
      type: "text/csv"
    });

    fireEvent.change(csvInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("1 valid")).toBeInTheDocument();
      expect(screen.getByText("1 invalid")).toBeInTheDocument();
    });
  });
});
