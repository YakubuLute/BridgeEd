import { Navigate, Route, Routes } from "react-router-dom";
import { Role } from "@bridgeed/shared";

import { RequireAuth } from "./features/auth/components/RequireAuth";
import { PublicRoute } from "./features/auth/components/PublicRoute";
import { LandingPage } from "./features/landing/pages/LandingPage";

// Auth Pages
import { PhoneOtpLoginPage } from "./features/auth/pages/PhoneOtpLoginPage";
import { EmailLoginPage } from "./features/auth/pages/EmailLoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";
import { EmailVerificationPage } from "./features/auth/pages/EmailVerificationPage";

// Dashboard Pages
import { TeacherDashboardPage } from "./features/dashboard/pages/TeacherDashboardPage";
import { SchoolAdminDashboardPage } from "./features/dashboard/pages/SchoolAdminDashboardPage";
import { NationalAdminDashboardPage } from "./features/dashboard/pages/NationalAdminDashboardPage";
import { ClassesPage } from "./features/dashboard/pages/ClassesPage";
import { ClassLearnersPage } from "./features/dashboard/pages/ClassLearnersPage";
import { AssessmentsPage } from "./features/dashboard/pages/AssessmentsPage";
import { ActivityPage } from "./features/dashboard/pages/ActivityPage";
import { ReportsPage } from "./features/dashboard/pages/ReportsPage";
import { SettingsPage } from "./features/dashboard/pages/SettingsPage";

const RoleSelectionPage = (): JSX.Element => <div>Select Your Role</div>;

const App = (): JSX.Element => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route element={<LandingPage />} path="/" />
      <Route element={<PhoneOtpLoginPage />} path="/login/phone" />
      <Route element={<EmailLoginPage />} path="/login/email" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<ForgotPasswordPage />} path="/forgot-password" />
      <Route element={<EmailVerificationPage />} path="/verify-email" />
    </Route>

    <Route element={<RequireAuth requireLayout={false} />}>
      <Route element={<RoleSelectionPage />} path="/role-selection" />
    </Route>

    <Route element={<RequireAuth allowedRoles={[Role.Teacher]} />}>
      <Route element={<TeacherDashboardPage />} path="/dashboard/teacher" />
      <Route element={<ClassesPage />} path="/classes" />
      <Route element={<AssessmentsPage />} path="/assessments" />
      <Route element={<ActivityPage />} path="/activity" />
      <Route element={<ReportsPage />} path="/reports" />
    </Route>

    <Route element={<RequireAuth allowedRoles={[Role.SchoolAdmin]} />}>
      <Route element={<SchoolAdminDashboardPage />} path="/dashboard/school-admin" />
      <Route element={<div>Manage Teachers</div>} path="/school-admin/teachers" />
      <Route element={<ReportsPage />} path="/school-admin/reports" />
    </Route>

    <Route element={<RequireAuth allowedRoles={[Role.NationalAdmin]} />}>
      <Route element={<NationalAdminDashboardPage />} path="/dashboard/national-admin" />
    </Route>

    <Route
      element={<RequireAuth allowedRoles={[Role.Teacher, Role.SchoolAdmin, Role.NationalAdmin]} />}
    >
      <Route element={<SettingsPage />} path="/settings" />
    </Route>

    <Route element={<Navigate replace to="/" />} path="*" />
  </Routes>
);

export default App;
