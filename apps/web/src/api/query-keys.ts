export const queryKeys = {
  system: {
    health: () => ["system", "health"] as const
  },
  auth: {
    requestOtp: () => ["auth", "otp", "request"] as const,
    verifyOtp: () => ["auth", "otp", "verify"] as const,
    emailLogin: () => ["auth", "email", "login"] as const,
    forgotPassword: () => ["auth", "email", "forgot-password"] as const
  }
};
