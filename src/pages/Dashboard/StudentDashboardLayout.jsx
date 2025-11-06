import { Link, Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import PaymentHistory from "./Payments/PaymentHistoryComponent";
import { useAuth } from "../../service/authService";
import StudentDetailsCard from "./StudentDetailsCard";
export default function DashboardPage() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Not Signed In</h2>
          <p className="text-gray-600 mb-6">You need to sign in to access your dashboard.</p>
          <Link
            to="/login"
            className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <StudentDetailsCard />
        <PaymentHistory />

        <Outlet />
      </main>
    </div>
  );
}
