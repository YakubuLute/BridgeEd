import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../test/render-with-providers";
import { RegisterPage } from "./RegisterPage";

const mockUseRegisterEmailMutation = vi.fn();

vi.mock("../../../api/hooks/useAuthMutations", () => ({
  useRegisterEmailMutation: (options: unknown) => mockUseRegisterEmailMutation(options)
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    mockUseRegisterEmailMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false
    });
  });

  it("keeps submit disabled until form is valid", async () => {
    renderWithProviders(<RegisterPage />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Kwame Mensah"), "Teacher Name");
    await user.type(screen.getByPlaceholderText("school-demo-001"), "school-demo-001");
    await user.type(screen.getByPlaceholderText("teacher@example.com"), "teacher@example.com");
    await user.type(screen.getByPlaceholderText("Create password"), "Teacher123");
    await user.type(screen.getByPlaceholderText("Re-enter password"), "Mismatch123");

    expect(screen.getByRole("button", { name: "Create Account" })).toBeDisabled();
  });

  it("submits normalized registration payload", async () => {
    const mutate = vi.fn();
    mockUseRegisterEmailMutation.mockReturnValue({
      mutate,
      isPending: false
    });

    renderWithProviders(<RegisterPage />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Kwame Mensah"), " Teacher Name ");
    await user.type(screen.getByPlaceholderText("school-demo-001"), " school-demo-001 ");
    await user.type(screen.getByPlaceholderText("teacher@example.com"), "Teacher@Example.com");
    await user.type(screen.getByPlaceholderText("Create password"), "Teacher123");
    await user.type(screen.getByPlaceholderText("Re-enter password"), "Teacher123");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    expect(mutate).toHaveBeenCalledWith({
      name: "Teacher Name",
      schoolId: "school-demo-001",
      email: "teacher@example.com",
      password: "Teacher123"
    });
  });
});
