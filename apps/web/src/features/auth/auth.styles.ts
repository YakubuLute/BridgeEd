export const authCardStyle = {
  border: "1px solid #E2E8F0",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
} as const;

export const authInputBaseStyle = {
  height: "48px",
  borderRadius: "10px",
  border: "1px solid #E2E8F0",
  backgroundColor: "#FFFFFF",
  fontSize: "16px",
  lineHeight: "24px",
  transition: "border-color 120ms ease, box-shadow 120ms ease"
} as const;

export const authInputClassNames = {
  input: "auth-input-control"
} as const;

export const authOtpInputClassNames = {
  input: "auth-otp-control"
} as const;

export const getAuthInputStyles = () => ({
  input: {
    ...authInputBaseStyle,
    boxShadow: "none"
  }
});

export const getOtpDigitStyles = () => ({
  input: {
    width: "48px",
    height: "48px",
    textAlign: "center" as const,
    fontSize: "20px",
    lineHeight: "28px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    backgroundColor: "#FFFFFF",
    color: "#151721",
    transition: "border-color 120ms ease, box-shadow 120ms ease",
    boxShadow: "none"
  }
});

export const getPhoneFieldContainerStyle = () => ({
  minHeight: "48px",
  borderRadius: "8px",
  border: "1px solid #E2E8F0",
  backgroundColor: "#FFFFFF",
  transition: "border-color 120ms ease, box-shadow 120ms ease"
});

export const getActionButtonStyles = () => ({
  label: {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: 700
  },
  root: {
    minHeight: "48px"
  }
});

export const getActionButtonClassName = (isReady: boolean): string =>
  isReady ? "auth-btn-valid" : "auth-btn-default";
