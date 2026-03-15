export const queryKeys = {
  system: {
    health: () => ["system", "health"] as const
  },
  auth: {
    requestOtp: () => ["auth", "otp", "request"] as const,
    verifyOtp: () => ["auth", "otp", "verify"] as const,
    emailRegister: () => ["auth", "email", "register"] as const,
    emailLogin: () => ["auth", "email", "login"] as const,
    forgotPassword: () => ["auth", "email", "forgot-password"] as const
  },
  activity: {
    list: () => ["activity", "list"] as const
  },
  classes: {
    list: () => ["classes", "list"] as const,
    create: () => ["classes", "create"] as const,
    update: () => ["classes", "update"] as const,
    learners: (classId: string) => ["classes", classId, "learners"] as const,
    assessmentOverview: (classId: string) => ["classes", classId, "assessment-overview"] as const,
    assessmentHistory: (classId: string) => ["classes", classId, "assessment-history"] as const
  },
  learners: {
    create: () => ["learners", "create"] as const,
    batchCreate: () => ["learners", "batch-create"] as const,
    profile: (learnerId: string) => ["learners", learnerId, "profile"] as const
  },
  schools: {
    detail: (schoolId: string) => ["schools", "detail", schoolId] as const
  }
};
