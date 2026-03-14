import { createTheme } from "@mantine/core";

export const bridgeEdTheme = createTheme({
  fontFamily: "Inter, system-ui, sans-serif",
  primaryColor: "brand",
  colors: {
    brand: [
      "#fff2e6",
      "#ffe4cc",
      "#ffc999",
      "#ffad66",
      "#ff9233",
      "#ff811a",
      "#e66a00", // primary index 6
      "#cc5e00",
      "#b35200",
      "#994600"
    ],
    // High-contrast orange from the inspiration
    schoolhub: [
      "#fff7ed",
      "#ffedd5",
      "#fed7aa",
      "#fdba74",
      "#fb923c",
      "#f97316",
      "#ea580c", // primary index 6
      "#c2410c",
      "#9a3412",
      "#7c2d12"
    ],
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#1A1B1E",
      "#141517",
      "#101113"
    ]
  },
  headings: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: "800"
  },
  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px"
  },
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.1)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
  }
});
