import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAuth } from "../../../service/authService";
import PaymentForm from "./components/PaymentForm";
import TemporaryReceipt from "./components/TemporaryReciept";
import OfficialReceipt from "./components/OfficialReciept";
import { Download, CheckCircle, XCircle, Clock } from "lucide-react";

export default function PaymentHistoryComponent() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptType, setReceiptType] = useState(null);
  const [studentInfo, setStudentInfo] = useState({ name: "", studentId: "" });
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      const q = query(collection(db, "payments"), where("uid", "==", currentUser.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.date?.toDate() - a.date?.toDate());
      setPayments(data);
    };
    fetchPayments();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          Approved
        </span>
      );
    }
    if (status === "Failed" || status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }
    if (status === "Verified - Pending Approval" || status === "Pending") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    return <span className="text-gray-600 text-xs">{status}</span>;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      <PaymentForm />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 text-xl">Your Payment History</h3>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No payments yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{p.level} level</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        ₦{p.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{formatDate(p.date)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(p.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(p.status === "Verified - Pending Approval" || p.status === "Pending") && (
                        <button
                          onClick={() => {
                            setSelectedPayment(p);
                            setReceiptType("temporary");
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Temp Receipt
                        </button>
                      )}
                      {p.status === "Approved" && (
                        <button
                          onClick={() => {
                            setSelectedPayment(p);
                            setReceiptType("official");
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Official Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPayment && receiptType === "temporary" && (
        <TemporaryReceipt
          payment={selectedPayment}
          studentInfo={studentInfo}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {selectedPayment && receiptType === "official" && (
        <OfficialReceipt
          payment={selectedPayment}
          studentInfo={studentInfo}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}