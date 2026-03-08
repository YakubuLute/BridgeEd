import { Navigate, Route, Routes } from "react-router-dom";
import { Role } from "@bridgeed/shared";

import { RequireAuth } from "./features/auth/components/RequireAuth";
import { EmailLoginPage } from "./features/auth/pages/EmailLoginPage";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";
import { PhoneOtpLoginPage } from "./features/auth/pages/PhoneOtpLoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import {
  NationalAdminDashboardPage,
  SchoolAdminDashboardPage
} from "./features/dashboard/pages/AdminPlaceholderPages";
import { ClassesPage } from "./features/dashboard/pages/ClassesPage";
import { ClassLearnersPage } from "./features/dashboard/pages/ClassLearnersPage";
import { AssessmentsPage } from "./features/dashboard/pages/AssessmentsPage";
import { AssessmentDetailPage } from "./features/dashboard/pages/AssessmentDetailPage";
import { LearnerProfilePage } from "./features/dashboard/pages/LearnerProfilePage";
import { RoleSelectionPage } from "./features/dashboard/pages/RoleSelectionPage";
import { SchoolDetailsPage } from "./features/dashboard/pages/SchoolDetailsPage";
import { TeacherDashboardPage } from "./features/dashboard/pages/TeacherDashboardPage";

const App = (): JSX.Element => (
  <Routes>
    <Route element={<PhoneOtpLoginPage />} path="/" />
    <Route element={<EmailLoginPage />} path="/login/email" />
    <Route element={<RegisterPage />} path="/register" />
    <Route element={<ForgotPasswordPage />} path="/forgot-password" />
    <Route
      element={
        <RequireAuth>
          <RoleSelectionPage />
        </RequireAuth>
      }
      path="/role-selection"
    />
    <Route
      element={
        <RequireAuth allowedRoles={[Role.Teacher]}>
          <TeacherDashboardPage />
        </RequireAuth>
      }
      path="/dashboard/teacher"
    />
    <Route
      element={
        <RequireAuth allowedRoles={[Role.Teacher]}>
          <ClassesPage />
        </RequireAuth>
      }
      path="/classes"
    />
    <Route
      element={
        <RequireAuth allowedRoles={[Role.Teacher]}>
          <AssessmentsPage />
        </RequireAuth>
      }
      path="/assessments"
    />
    <Route
      element={
        <RequireAuth allowedRoles={[Role.Teacher]}>
          <AssessmentDetailPage />
        </RequireAuth>
      }
      path="/assessments/:learnerId"
    />
    <Route
      element={
        <RequireAuth allowedRoles={[Role.Teacher]}>
          <ClassLearnersPage />
        </RequireAuth>
      }
      path="/classes/:classId"
    />
    <Route
      element={
        <RequireAuth allowedRoles={[Role.Teacher]}>
          <LearnerProfilePage />
        </RequireAuth>
      }
      path="/learners/:learnerId/profile"
    />
    <Route
      element={
        <RequireAuth allowedRoles={[Role.SchoolAdmin]}>
          <SchoolDetailsPage />
        </RequireAuth>
      }
      path="/school-admin/school"
    />
    <Route
      element={
        <RequireAuth allowedRoles={[Role.SchoolAdmin]}>
          <SchoolAdminDashboardPage />
        </RequireAuth>
      }
      path="/dashboard/school-admin"
    />
    <Route
      element={
        <RequireAuth allowedRoles={[Role.NationalAdmin]}>
          <SchoolDetailsPage />
        </RequireAuth>
      }
      path="/admin/schools"
    />
    <Route
      element={
        <RequireAuth allowedRoles={[Role.NationalAdmin]}>
          <NationalAdminDashboardPage />
        </RequireAuth>
      }
      path="/dashboard/national-admin"
    />
    <Route element={<Navigate replace to="/" />} path="*" />
  </Routes>
);

export default App;
