import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { LearnerProfileResponse } from "@bridgeed/shared";

import { bridgeEdTheme } from "../../../styles/theme";
import { LearnerProfilePage } from "./LearnerProfilePage";

const mockUseLearnerProfileQuery = vi.fn();

vi.mock("../../../api/hooks/useLearnerQueries", () => ({
  useLearnerProfileQuery: (learnerId: string) => mockUseLearnerProfileQuery(learnerId)
}));

const renderPage = (): void => {
  render(
    <MantineProvider theme={bridgeEdTheme} defaultColorScheme="light">
      <MemoryRouter initialEntries={["/learners/learner-1/profile"]}>
        <Routes>
          <Route element={<LearnerProfilePage />} path="/learners/:learnerId/profile" />
        </Routes>
      </MemoryRouter>
    </MantineProvider>
  );
};

const buildProfile = (overrides: Partial<LearnerProfileResponse>): LearnerProfileResponse => ({
  learner: {
    id: "1",
    learnerId: "learner-1",
    schoolId: "school-demo-001",
    classId: "class-1",
    name: "Kwame Mensah",
    gradeLevel: "JHS1",
    createdBy: "teacher-1",
    createdAt: "2026-02-20T00:00:00.000Z",
    updatedAt: "2026-02-20T00:00:00.000Z"
  },
  assessmentTimeline: [],
  masteryTrends: [],
  ...overrides
});

describe("LearnerProfilePage", () => {
  beforeEach(() => {
    mockUseLearnerProfileQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: buildProfile({})
    });
  });

  it("renders explicit empty states when timeline and trends are missing", () => {
    renderPage();

    expect(screen.getByText("No assessments have been recorded yet.")).toBeInTheDocument();
    expect(
      screen.getByText("No skill mastery data available yet. Run an assessment to populate trends.")
    ).toBeInTheDocument();
  });

  it("renders assessment timeline and mastery trend entries when data exists", () => {
    mockUseLearnerProfileQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: buildProfile({
        assessmentTimeline: [
          {
            attemptId: "attempt-1",
            assessmentName: "Literacy Screener",
            domain: "Literacy",
            score: 58,
            assessedAt: "2026-02-20T00:00:00.000Z"
          }
        ],
        masteryTrends: [
          {
            skillCode: "phonics",
            skillName: "Phonics & Decoding",
            points: [
              {
                measuredAt: "2026-02-10T00:00:00.000Z",
                masteryScore: 45,
                confidence: 0.65
              },
              {
                measuredAt: "2026-02-20T00:00:00.000Z",
                masteryScore: 62,
                confidence: 0.78
              }
            ]
          }
        ]
      })
    });

    renderPage();

    expect(screen.getByText("Literacy Screener")).toBeInTheDocument();
    expect(screen.getByText("Phonics & Decoding")).toBeInTheDocument();
    expect(screen.getByText(/Feb/)).toBeInTheDocument();
  });
});
