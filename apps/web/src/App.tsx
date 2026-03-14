import { Navigate, Route, Routes } from "react-router-dom";
import { Role } from "@bridgeed/shared";

import { PhoneOtpLoginPage } from "./features/auth/pages/PhoneOtpLoginPage";
import { EmailLoginPage } from "./features/auth/pages/EmailLoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";

import { RequireAuth } from "./features/auth/components/RequireAuth";
import { PublicRoute } from "./features/auth/components/PublicRoute";

const TeacherDashboard = (): JSX.Element => <div>Teacher Dashboard</div>;
const SchoolAdminDashboard = (): JSX.Element => <div>School Admin Dashboard</div>;
const RoleSelectionPage = (): JSX.Element => <div>Select Your Role</div>;

const App = (): JSX.Element => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route element={<PhoneOtpLoginPage />} path="/" />
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
