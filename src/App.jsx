import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import AdminDashboardLayout from "./pages/Admin/AdminDashboardLayout";
import StudentDashboardLayout from "./pages/Dashboard/StudentDashboardLayout";
import PaymentHistory from "./pages/PaymentHistory";
import Profile from "./pages/Profile";
import AdminDashboardHome from "./pages/Admin/AdminDashboardHome";
import AdminStudents from "./pages/Admin/AdminStudents";
import AdminPayments from "./pages/Admin/AdminPayments";
import AdminSettings from "./pages/Admin/AdminSettings";  
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Dashboard */}
      <Route
  path="/dashboard/*"
  element={
    <ProtectedRoute requiredRole="student">
      <StudentDashboardLayout />
    </ProtectedRoute>
  }
/>

<Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardLayout /></ProtectedRoute>}>
  <Route index element={<AdminDashboardHome />} />
  <Route path="students" element={<AdminStudents />} />
  <Route path="payments" element={<AdminPayments />} />
  <Route path="settings" element={<AdminSettings />} />
</Route>


      {/* Unauthorized fallback */}
      <Route path="/unauthorized" element={<div>Access denied</div>} />
    </Routes>
  );
}

export default App;
