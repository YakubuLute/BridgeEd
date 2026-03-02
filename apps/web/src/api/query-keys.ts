export const queryKeys = {
  system: {
    health: () => ["system", "health"] as const
  },
  auth: {
    requestOtp: () => ["auth", "otp", "request"] as const,
    verifyOtp: () => ["auth", "otp", "verify"] as const,
    emailLogin: () => ["auth", "email", "login"] as const,
    forgotPassword: () => ["auth", "email", "forgot-password"] as const
  },
  classes: {
    list: () => ["classes", "list"] as const,
    create: () => ["classes", "create"] as const,
    update: () => ["classes", "update"] as const,
    learners: (classId: string) => ["classes", classId, "learners"] as const
  },
  learners: {
    create: () => ["learners", "create"] as const,
    batchCreate: () => ["learners", "batch-create"] as const,
    profile: (learnerId: string) => ["learners", learnerId, "profile"] as const
  }
};
