import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Loader, CheckCircle, Eye, X } from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [previewPayment, setPreviewPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Fetch payments
        const q = query(collection(db, "payments"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);

        const paymentList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        /// Fetch all users to get names
        // Fetch all users to get names
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersMap = {};
        
        // Map users by their document ID (uid)
        usersSnapshot.docs.forEach((doc) => {
          const userData = doc.data();
          usersMap[doc.id] = {
            name: userData.name,
            department: userData.department,
            regNo: userData.regNo,
          };
        });

        // Merge payment data with user data
        const enrichedPayments = paymentList.map((payment) => {
          const userInfo = usersMap[payment.uid];
          
          return {
            ...payment,
            name: userInfo?.name || payment.name || "N/A",
            department: userInfo?.department || payment.department || "—",
            regNo: userInfo?.regNo || payment.regNo || "N/A",
          };
        });
        setPayments(enrichedPayments);
      } catch (err) {
        console.error("❌ Error fetching payments:", err);
        setError("Failed to load payments. Check your Firestore rules or network.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleStatusUpdate = async (paymentId, newStatus) => {
    setUpdating(paymentId);
    try {
      const paymentRef = doc(db, "payments", paymentId);
      await updateDoc(paymentRef, {
        status: newStatus,
        updatedAt: new Date(),
      });

      // Update local state
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: newStatus } 
          : payment
      ));
      
      // Close preview modal after approval
      setPreviewPayment(null);
    } catch (err) {
      console.error("❌ Error updating payment status:", err);
      alert("Failed to update payment status");
    } finally {
      setUpdating(null);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start bg-white border border-red-200 p-6 rounded-2xl shadow-sm">
            <div className="bg-red-100 p-2 rounded-lg mr-4">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Error Loading Data</h3>
              <p className="text-slate-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Payments Overview
          </h1>
          <p className="text-slate-600">
            Manage and approve student payment submissions
          </p>
        </div>

        {/* Table */}
        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200">
            <p className="text-slate-600 text-lg font-medium">No payments found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-slate-700 font-semibold text-sm">
                      Name
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 font-semibold text-sm">
                      Matric Number
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 font-semibold text-sm">
                      Department
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 font-semibold text-sm">
                      Payment Type
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 font-semibold text-sm">
                      Amount
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 font-semibold text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">
                          {payment.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-mono text-sm">
                        {payment.regNo || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {payment.department || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {payment.paymentType || payment.level || "—"}
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewPayment(payment)}
                            className="text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View & Approve"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {payment.status !== "Approved" && (
                            <button
                              onClick={() => handleStatusUpdate(payment.id, "Approved")}
                              disabled={updating === payment.id}
                              className="text-green-700 hover:text-green-800 hover:bg-green-50 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve"
                            >
                              {updating === payment.id ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        {payments.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Total Payments: <span className="font-semibold text-slate-700">{payments.length}</span>
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Payment Receipt</h2>
              <button
                onClick={() => setPreviewPayment(null)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-6">
              {/* Student Info */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Name</p>
                    <p className="font-semibold text-slate-900">{previewPayment.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Matric Number</p>
                    <p className="font-semibold text-slate-900 font-mono">{previewPayment.regNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Department</p>
                    <p className="font-semibold text-slate-900">{previewPayment.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Payment Type</p>
                    <p className="font-semibold text-slate-900">{previewPayment.paymentType || previewPayment.level}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Amount</p>
                    <p className="text-2xl font-bold text-green-700">₦{previewPayment.amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Status</p>
                    <span
                      className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${
                        previewPayment.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {previewPayment.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Proof */}
              {previewPayment.proofUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Proof</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <img
                      src={previewPayment.proofUrl}
                      alt="Payment Proof"
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center justify-center p-12 bg-slate-50">
                      <p className="text-slate-600">Unable to display image. <a href={previewPayment.proofUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Open in new tab</a></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewPayment(null)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
                {previewPayment.status !== "Approved" && (
                  <button
                    onClick={() => handleStatusUpdate(previewPayment.id, "Approved")}
                    disabled={updating === previewPayment.id}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updating === previewPayment.id ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Approve Payment
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}