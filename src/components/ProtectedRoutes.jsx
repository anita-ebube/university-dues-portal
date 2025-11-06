import { Navigate } from "react-router-dom";
import { useAuth } from "../service/authService";

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;

  const userRole = currentUser.role?.toLowerCase();
;

  if (requiredRole && userRole !== requiredRole.toLowerCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
