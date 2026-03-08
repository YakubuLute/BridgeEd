import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { describe, expect, it, vi } from "vitest";
import { Role } from "@bridgeed/shared";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { bridgeEdTheme } from "../../../styles/theme";
import { RoleSelectionPage } from "./RoleSelectionPage";

const mockReadSession = vi.fn();

vi.mock("../../../utils/session", () => ({
  readSession: () => mockReadSession()
}));

const renderRoleSelection = (): void => {
  render(
    <MantineProvider theme={bridgeEdTheme} defaultColorScheme="light">
      <MemoryRouter initialEntries={["/role-selection"]}>
        <Routes>
          <Route element={<RoleSelectionPage />} path="/role-selection" />
          <Route element={<div>Teacher Dashboard</div>} path="/dashboard/teacher" />
        </Routes>
      </MemoryRouter>
    </MantineProvider>
  );
};

describe("RoleSelectionPage", () => {
  it("auto redirects when user has only one role", () => {
    mockReadSession.mockReturnValue({
      accessToken: "token",
      user: {
        id: "teacher-1",
        role: Role.Teacher,
        name: "Teacher User"
      }
    });

    renderRoleSelection();

    expect(screen.getByText("Teacher Dashboard")).toBeInTheDocument();
  });

  it("renders only assigned roles for multi-role users", () => {
    mockReadSession.mockReturnValue({
      accessToken: "token",
      user: {
        id: "multi-1",
        role: Role.Teacher,
        roles: [Role.Teacher, Role.SchoolAdmin],
        name: "Multi User"
      }
    });

    renderRoleSelection();

    expect(screen.getByText("Select Role")).toBeInTheDocument();
    expect(screen.getByText("Teacher")).toBeInTheDocument();
    expect(screen.getByText("School Admin")).toBeInTheDocument();
    expect(screen.queryByText("National Admin")).not.toBeInTheDocument();
  });
});
