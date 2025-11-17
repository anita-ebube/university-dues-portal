import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Users, CreditCard, CheckCircle, TrendingUp, Clock, AlertCircle } from "lucide-react";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPayments: 0,
    totalAmount: 0,
    approvedPayments: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const totalStudents = usersSnapshot.size;

        // Fetch all payments
        const paymentsSnapshot = await getDocs(collection(db, "payments"));
        const payments = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate payment stats
        const totalPayments = payments.length;
        const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        const approvedPayments = payments.filter(p => p.status === "Approved").length;
        const pendingPayments = payments.filter(p => p.status !== "Approved").length;

        // Get recent payments (last 5)
        const sortedPayments = payments
          .sort((a, b) => {
            const dateA = a.date?.toDate?.() || new Date(a.date || 0);
            const dateB = b.date?.toDate?.() || new Date(b.date || 0);
            return dateB - dateA;
          })
          .slice(0, 5);

        // Create users map for enriching payment data
        const usersMap = {};
        usersSnapshot.docs.forEach((doc) => {
          const userData = doc.data();
          usersMap[doc.id] = {
            name: userData.name,
            regNo: userData.regNo,
          };
        });

        // Enrich recent payments with user data
        const enrichedPayments = sortedPayments.map(payment => ({
          ...payment,
          name: usersMap[payment.uid]?.name || "N/A",
          regNo: usersMap[payment.uid]?.regNo || "N/A",
        }));

        setStats({
          totalStudents,
          totalPayments,
          totalAmount,
          approvedPayments,
          pendingPayments,
        });

        setRecentPayments(enrichedPayments);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-green-700 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 font-medium mt-4">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Admin Dashboard 
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Total Students
                  </h2>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  {stats.totalStudents}
                </p>
                <p className="text-sm text-slate-500">
                  Registered users
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Payments */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Total Revenue
                  </h2>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  ₦{stats.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">
                  {stats.totalPayments} payments
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Approved Payments */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Approved Dues
                  </h2>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  {stats.approvedPayments}
                </p>
                <p className="text-sm text-slate-500">
                  {stats.totalPayments > 0 
                    ? Math.round((stats.approvedPayments / stats.totalPayments) * 100)
                    : 0}% approval rate
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Pending
                  </h2>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  {stats.pendingPayments}
                </p>
                <p className="text-sm text-slate-500">
                  Awaiting approval
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>


         </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Recent Payments</h2>
            <p className="text-sm text-slate-600">Latest payment submissions</p>
          </div>
          
          {recentPayments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500">No payments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-3 text-slate-700 font-semibold text-sm">
                      Student
                    </th>
                    <th className="text-left px-6 py-3 text-slate-700 font-semibold text-sm">
                      Matric No.
                    </th>
                    <th className="text-left px-6 py-3 text-slate-700 font-semibold text-sm">
                      Amount
                    </th>
                    <th className="text-left px-6 py-3 text-slate-700 font-semibold text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">
                          {payment.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-mono text-sm">
                        {payment.regNo}
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-semibold">
                        ₦{payment.amount?.toLocaleString() || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${
                            payment.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {payment.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}