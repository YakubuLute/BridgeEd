import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Role, type SchoolRecord } from "@bridgeed/shared";
import type { ReactNode } from "react";

import { renderWithProviders } from "../../../test/render-with-providers";
import { SchoolDetailsPage } from "./SchoolDetailsPage";

const mockUseSchoolDetailsQuery = vi.fn();
const mockReadSession = vi.fn();

vi.mock("../../../api/hooks/useSchoolQueries", () => ({
  useSchoolDetailsQuery: (schoolId: string) => mockUseSchoolDetailsQuery(schoolId)
}));

vi.mock("../../../utils/session", () => ({
  readSession: () => mockReadSession()
}));

vi.mock("../components/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

const defaultSchool: SchoolRecord = {
  id: "1",
  schoolId: "school-demo-001",
  name: "BridgeEd Demo School",
  district: "Accra Metro",
  region: "Greater Accra",
  isActive: true,
  createdAt: "2026-03-01T00:00:00.000Z",
  updatedAt: "2026-03-01T00:00:00.000Z"
};

describe("SchoolDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSchoolDetailsQuery.mockReturnValue({
      data: defaultSchool,
      isLoading: false,
      error: null
    });

    mockReadSession.mockReturnValue({
      accessToken: "token",
      user: {
        id: "school-admin-1",
        role: Role.SchoolAdmin,
        name: "School Admin",
        scope: {
          schoolId: "school-demo-001"
        }
      }
    });
  });

  it("renders school identifier details for school admin and supports copy action", async () => {
    renderWithProviders(<SchoolDetailsPage />);
    const user = userEvent.setup();

    expect(screen.getByText("BridgeEd Demo School")).toBeInTheDocument();
    expect(screen.getByText("school-demo-001")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(
      screen.getByText(/School identifier copied\.|Unable to copy automatically\./)
    ).toBeInTheDocument();
  });

  it("shows validation when national admin searches without school identifier", async () => {
    mockReadSession.mockReturnValue({
      accessToken: "token",
      user: {
        id: "national-admin-1",
        role: Role.NationalAdmin,
        name: "National Admin",
        scope: {
          region: "Greater Accra"
        }
      }
    });

    mockUseSchoolDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null
    });

    renderWithProviders(<SchoolDetailsPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Load School" }));
    expect(screen.getByText("Enter a school identifier to load details.")).toBeInTheDocument();
  });
});
