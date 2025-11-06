import { Users, CreditCard, CheckCircle } from "lucide-react";

export default function AdminDashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Admin Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center space-x-4">
          <Users className="w-10 h-10 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold">Total Students</h2>
            <p className="text-gray-500 text-sm">154</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center space-x-4">
          <CreditCard className="w-10 h-10 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold">Total Payments</h2>
            <p className="text-gray-500 text-sm">₦230,000</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center space-x-4">
          <CheckCircle className="w-10 h-10 text-purple-600" />
          <div>
            <h2 className="text-lg font-semibold">Verified Dues</h2>
            <p className="text-gray-500 text-sm">112</p>
          </div>
        </div>
      </div>
    </div>
  );
}
