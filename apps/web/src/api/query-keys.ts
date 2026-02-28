export const queryKeys = {
  system: {
    health: () => ["system", "health"] as const
  },
  auth: {
    requestOtp: () => ["auth", "otp", "request"] as const,
    verifyOtp: () => ["auth", "otp", "verify"] as const
  }
};
