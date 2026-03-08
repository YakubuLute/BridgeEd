import { MantineProvider } from "@mantine/core";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";

import { bridgeEdTheme } from "../styles/theme";

export const renderWithProviders = (ui: ReactElement, initialEntries: string[] = ["/"]): ReturnType<typeof render> =>
  render(
    <MantineProvider theme={bridgeEdTheme} defaultColorScheme="light">
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </MantineProvider>
  );
