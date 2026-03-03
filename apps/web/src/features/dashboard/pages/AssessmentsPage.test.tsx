import { fireEvent, render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GradeLevel, type ClassAssessmentOverviewResponse, type ClassRecord } from "@bridgeed/shared";
import type { ReactNode } from "react";

import { bridgeEdTheme } from "../../../styles/theme";
import { AssessmentsPage } from "./AssessmentsPage";

const mockUseClassesQuery = vi.fn();
const mockUseClassAssessmentOverviewQuery = vi.fn();

vi.mock("../../../api/hooks/useClassQueries", () => ({
  useClassesQuery: () => mockUseClassesQuery(),
  useClassAssessmentOverviewQuery: (classId: string) => mockUseClassAssessmentOverviewQuery(classId)
}));

vi.mock("../components/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

const seedClass: ClassRecord = {
  id: "1",
  classId: "class-1",
  schoolId: "school-demo-001",
  teacherId: "teacher-1",
  name: "JHS 1A",
  gradeLevel: GradeLevel.JHS1,
  subject: "Mathematics",
  academicYear: "2025/2026",
  isActive: true,
  createdAt: new Date("2026-02-01T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-02-01T00:00:00.000Z").toISOString()
};

const seedOverview: ClassAssessmentOverviewResponse = {
  class: {
    classId: "class-1",
    name: "JHS 1A",
    gradeLevel: GradeLevel.JHS1,
    subject: "Mathematics"
  },
  summary: {
    atRisk: 1,
    support: 1,
    onTrack: 1,
    totalStudents: 3
  },
  learners: [
    {
      learnerId: "learner-1",
      name: "Kwame Mensah",
      gradeLevel: GradeLevel.JHS1,
      status: "at_risk",
      literacyScore: 45,
      numeracyScore: 52,
      lastAssessedAt: new Date("2026-03-01T00:00:00.000Z").toISOString()
    },
    {
      learnerId: "learner-2",
      name: "Akua Asante",
      gradeLevel: GradeLevel.JHS1,
      status: "on_track",
      literacyScore: 82,
      numeracyScore: 86,
      lastAssessedAt: new Date("2026-03-02T00:00:00.000Z").toISOString()
    },
    {
      learnerId: "learner-3",
      name: "Kofi Owusu",
      gradeLevel: GradeLevel.JHS1,
      status: "support",
      literacyScore: 62,
      numeracyScore: 58,
      lastAssessedAt: new Date("2026-02-28T00:00:00.000Z").toISOString()
    }
  ]
};

const renderPage = (): void => {
  render(
    <MantineProvider theme={bridgeEdTheme} defaultColorScheme="light">
      <MemoryRouter initialEntries={["/assessments"]}>
        <Routes>
          <Route element={<AssessmentsPage />} path="/assessments" />
        </Routes>
      </MemoryRouter>
    </MantineProvider>
  );
};

describe("AssessmentsPage", () => {
  beforeEach(() => {
    mockUseClassesQuery.mockReturnValue({
      data: [seedClass],
      isLoading: false,
      isError: false
    });
    mockUseClassAssessmentOverviewQuery.mockReturnValue({
      data: seedOverview,
      isLoading: false,
      isError: false
    });
  });

  it("renders assessment summary and learner entries", () => {
    renderPage();

    expect(screen.getAllByText("JHS 1A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("At Risk").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Kwame Mensah").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Akua Asante").length).toBeGreaterThan(0);
  });

  it("filters learners by search query", () => {
    renderPage();

    const searchInput = screen.getAllByPlaceholderText("Search students...")[0];
    if (!searchInput) {
      throw new Error("Search input not found.");
    }

    fireEvent.change(searchInput, {
      target: { value: "Akua" }
    });

    expect(screen.getAllByText("Akua Asante").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Kwame Mensah")).toHaveLength(0);
  });
});
