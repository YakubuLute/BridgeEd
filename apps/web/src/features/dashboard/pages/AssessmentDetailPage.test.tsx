import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GradeLevel, type ClassRecord, type LearnerProfileResponse } from "@bridgeed/shared";
import type { ReactNode } from "react";

import { bridgeEdTheme } from "../../../styles/theme";
import { AssessmentDetailPage } from "./AssessmentDetailPage";

const mockUseClassesQuery = vi.fn();
const mockUseLearnerProfileQuery = vi.fn();

vi.mock("../../../api/hooks/useClassQueries", () => ({
  useClassesQuery: () => mockUseClassesQuery()
}));

vi.mock("../../../api/hooks/useLearnerQueries", () => ({
  useLearnerProfileQuery: (learnerId: string) => mockUseLearnerProfileQuery(learnerId)
}));

vi.mock("../components/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

const seededClass: ClassRecord = {
  id: "1",
  classId: "class-1",
  schoolId: "school-demo-001",
  teacherId: "teacher-1",
  name: "JHS 1A",
  gradeLevel: GradeLevel.JHS1,
  subject: "Mathematics",
  academicYear: "2025/2026",
  isActive: true,
  createdAt: "2026-02-20T00:00:00.000Z",
  updatedAt: "2026-02-20T00:00:00.000Z"
};

const seededProfile: LearnerProfileResponse = {
  learner: {
    id: "learner-db-id-1",
    learnerId: "learner-1",
    schoolId: "school-demo-001",
    classId: "class-1",
    name: "Kwame Mensah",
    gradeLevel: GradeLevel.JHS1,
    createdBy: "teacher-1",
    createdAt: "2026-02-20T00:00:00.000Z",
    updatedAt: "2026-02-20T00:00:00.000Z"
  },
  assessmentTimeline: [
    {
      attemptId: "a1",
      assessmentName: "Literacy Screener",
      domain: "Literacy",
      score: 64,
      assessedAt: "2026-02-27T00:00:00.000Z"
    },
    {
      attemptId: "a2",
      assessmentName: "Numeracy Screener",
      domain: "Numeracy",
      score: 49,
      assessedAt: "2026-02-24T00:00:00.000Z"
    }
  ],
  masteryTrends: []
};

const renderPage = (): void => {
  render(
    <MantineProvider theme={bridgeEdTheme} defaultColorScheme="light">
      <MemoryRouter initialEntries={["/assessments/learner-1"]}>
        <Routes>
          <Route element={<AssessmentDetailPage />} path="/assessments/:learnerId" />
        </Routes>
      </MemoryRouter>
    </MantineProvider>
  );
};

describe("AssessmentDetailPage", () => {
  beforeEach(() => {
    mockUseClassesQuery.mockReturnValue({
      data: [seededClass],
      isLoading: false,
      isError: false
    });
    mockUseLearnerProfileQuery.mockReturnValue({
      data: seededProfile,
      isLoading: false,
      isError: false
    });
  });

  it("renders learner header and assessment sections", () => {
    renderPage();

    expect(screen.getByText("Kwame Mensah")).toBeInTheDocument();
    expect(screen.getByText("Select Assessment Area")).toBeInTheDocument();
    expect(screen.getByText("Foundational Literacy")).toBeInTheDocument();
    expect(screen.getByText("Foundational Numeracy")).toBeInTheDocument();
    expect(screen.getByText("Previous Assessments")).toBeInTheDocument();
    expect(screen.getByText("Literacy Assessment")).toBeInTheDocument();
    expect(screen.getByText("Numeracy Assessment")).toBeInTheDocument();
  });
});
