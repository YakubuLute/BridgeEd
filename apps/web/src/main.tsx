import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { bridgeEdTheme } from "./styles/theme";

import "@mantine/core/styles.css";
import "./styles/index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <MantineProvider theme={bridgeEdTheme} defaultColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>
);
