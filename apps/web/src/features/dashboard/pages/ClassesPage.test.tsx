import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ClassRecord } from "@bridgeed/shared";

import { renderWithProviders } from "../../../test/render-with-providers";
import { ClassesPage } from "./ClassesPage";

const mockUseClassesQuery = vi.fn();
const mockUseCreateClassMutation = vi.fn();
const mockUseUpdateClassMutation = vi.fn();

vi.mock("../../../api/hooks/useClassQueries", () => ({
  useClassesQuery: () => mockUseClassesQuery(),
  useCreateClassMutation: (options: unknown) => mockUseCreateClassMutation(options),
  useUpdateClassMutation: (options: unknown) => mockUseUpdateClassMutation(options)
}));

const defaultClasses: ClassRecord[] = [];

describe("ClassesPage", () => {
  beforeEach(() => {
    mockUseClassesQuery.mockReturnValue({
      data: defaultClasses,
      isLoading: false,
      isError: false
    });

    mockUseCreateClassMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false
    });

    mockUseUpdateClassMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false
    });
  });

  it("shows validation error when class name is missing", async () => {
    renderWithProviders(<ClassesPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Create Class" }));

    expect(screen.getByText("Class name is required.")).toBeInTheDocument();
  });

  it("submits valid class data", async () => {
    const mutate = vi.fn();
    mockUseCreateClassMutation.mockReturnValue({
      mutate,
      isPending: false
    });

    renderWithProviders(<ClassesPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Class name"), "JHS 1A");
    await user.click(screen.getByRole("button", { name: "Create Class" }));

    expect(mutate).toHaveBeenCalledWith({
      name: "JHS 1A",
      gradeLevel: "JHS1",
      subject: undefined,
      academicYear: undefined
    });
  });
});
