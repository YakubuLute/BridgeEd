import { Navigate, Route, Routes } from "react-router-dom";

import { EmailLoginPage } from "./features/auth/pages/EmailLoginPage";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";
import { PhoneOtpLoginPage } from "./features/auth/pages/PhoneOtpLoginPage";

const App = (): JSX.Element => (
  <Routes>
    <Route element={<PhoneOtpLoginPage />} path="/" />
    <Route element={<EmailLoginPage />} path="/login/email" />
    <Route element={<ForgotPasswordPage />} path="/forgot-password" />
    <Route element={<Navigate replace to="/" />} path="*" />
  </Routes>
);

export default App;
