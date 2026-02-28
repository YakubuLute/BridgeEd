export const authCardStyle = {
  border: "1px solid #D5D6DD",
  backgroundColor: "#F7F7F9",
  boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.12)"
} as const;

export const authInputBaseStyle = {
  height: "56px",
  borderRadius: "14px",
  border: "2px solid #D5D6DD",
  backgroundColor: "#E8E8ED",
  fontSize: "16px",
  lineHeight: "24px",
  transition: "border-color 120ms ease"
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
    height: "56px",
    textAlign: "center" as const,
    fontSize: "20px",
    lineHeight: "28px",
    borderRadius: "12px",
    border: "2px solid #D5D6DD",
    backgroundColor: "#E8E8ED",
    color: "#151721",
    transition: "border-color 120ms ease",
    boxShadow: "none"
  }
});

export const getPhoneFieldContainerStyle = () => ({
  minHeight: "64px",
  borderRadius: "14px",
  border: "2px solid #D5D6DD",
  backgroundColor: "#E8E8ED",
  transition: "border-color 120ms ease"
});

export const getActionButtonStyles = () => ({
  label: {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: 700
  },
  root: {
    minHeight: "56px"
  }
});

export const getActionButtonClassName = (isReady: boolean): string =>
  isReady ? "auth-btn-valid" : "auth-btn-default";
