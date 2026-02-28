export const COUNTRY_CODE = "+233";
export const PHONE_DIGIT_LIMIT = 10;
export const OTP_LENGTH = 6;
export const SESSION_STORAGE_KEY = "bridgeed.session";
export const DEFAULT_OTP_EXPIRY_SECONDS = 300;
export const MAX_LOGIN_ATTEMPTS = 3;
export const LOCKOUT_DURATION_MINUTES = 15;

export type PasswordValidation = {
  isValid: boolean;
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
};

export type PasswordStrength = {
  label: "Weak" | "Medium" | "Strong";
  color: string;
};

export const emptyOtp = (): string[] => Array.from({ length: OTP_LENGTH }, () => "");

export const sanitizePhoneDigits = (value: string): string =>
  value.replace(/[^\d]/g, "").slice(0, PHONE_DIGIT_LIMIT);

export const toE164Phone = (value: string): string => `${COUNTRY_CODE}${value.replace(/^0/, "")}`;

export const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): PasswordValidation => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
    minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber
  };
};

export const getPasswordStrength = (password: string): PasswordStrength | null => {
  if (!password) {
    return null;
  }

  const validation = validatePassword(password);
  const score = [
    validation.minLength,
    validation.hasUpperCase,
    validation.hasLowerCase,
    validation.hasNumber
  ].filter(Boolean).length;

  if (score === 4) {
    return { label: "Strong", color: "#15803D" };
  }

  if (score >= 2) {
    return { label: "Medium", color: "#D97706" };
  }

  return { label: "Weak", color: "#DC2626" };
};

export const requirementColor = (isMet: boolean): string => (isMet ? "#15803D" : "#6A6C7D");
