import { Navigate, Route, Routes } from "react-router-dom";
import { Role } from "@bridgeed/shared";

const App = (): JSX.Element => (
  <Routes>
    <Route element={<Navigate replace to="/" />} path="*" />
  </Routes>
);

export default App;
