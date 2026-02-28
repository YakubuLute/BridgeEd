import { createTheme } from "@mantine/core";

export const bridgeEdTheme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  fontSizes: {
    h1: "28px",
    h2: "22px",
    body: "16px",
    caption: "14px",
    small: "12px"
  },
  primaryColor: "bridgeed",
  colors: {
    bridgeed: [
      "#f3f3f5",
      "#e8e8ec",
      "#d5d6dd",
      "#b9bbc5",
      "#9fa1af",
      "#868791",
      "#6f707d",
      "#575966",
      "#40424f",
      "#292b37"
    ]
  },
  radius: {
    sm: "10px",
    md: "14px",
    lg: "18px",
    xl: "20px"
  }
});
