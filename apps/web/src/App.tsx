import { Navigate, Route, Routes } from "react-router-dom";
import { Role } from "@bridgeed/shared";

import { RequireAuth } from "./features/auth/components/RequireAuth";
import { PublicRoute } from "./features/auth/components/PublicRoute";
import { LandingPage } from "./features/landing/pages/LandingPage";

const PhoneOtpLoginPage = (): JSX.Element => <div>Phone OTP Login Page</div>;
const EmailLoginPage = (): JSX.Element => <div>Email Login Page</div>;
const RegisterPage = (): JSX.Element => <div>Register Page</div>;
const ForgotPasswordPage = (): JSX.Element => <div>Forgot Password Page</div>;
const TeacherDashboard = (): JSX.Element => <div>Teacher Dashboard</div>;
const SchoolAdminDashboard = (): JSX.Element => <div>School Admin Dashboard</div>;
const RoleSelectionPage = (): JSX.Element => <div>Select Your Role</div>;

const App = (): JSX.Element => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route element={<LandingPage />} path="/" />
      <Route element={<PhoneOtpLoginPage />} path="/login/phone" />
      <Route element={<EmailLoginPage />} path="/login/email" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<ForgotPasswordPage />} path="/forgot-password" />
    </Route>

    <Route element={<RequireAuth requireLayout={false} />}>
      <Route element={<RoleSelectionPage />} path="/role-selection" />
    </Route>

    <Route element={<RequireAuth allowedRoles={[Role.Teacher]} />}>
      <Route element={<TeacherDashboard />} path="/dashboard/teacher" />
      <Route element={<div>Classes</div>} path="/classes" />
      <Route element={<div>Assessments</div>} path="/assessments" />
    </Route>

    <Route element={<RequireAuth allowedRoles={[Role.SchoolAdmin]} />}>
      <Route element={<SchoolAdminDashboard />} path="/dashboard/school-admin" />
      <Route element={<div>Manage Teachers</div>} path="/school-admin/teachers" />
    </Route>

    <Route
      element={<RequireAuth allowedRoles={[Role.Teacher, Role.SchoolAdmin, Role.NationalAdmin]} />}
    >
      <Route element={<div>Global Settings</div>} path="/settings" />
    </Route>

    <Route element={<Navigate replace to="/" />} path="*" />
  </Routes>
);

export default App;
