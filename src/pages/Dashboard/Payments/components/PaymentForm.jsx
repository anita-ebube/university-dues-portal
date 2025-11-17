import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { useAuth } from "../../../../service/authService";
import { PaystackButton } from "react-paystack";
import { levelPrices } from "../utils/levelPrices";
import { Loader, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

const getPaystackPublicKey = () => {
  return import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_c110ed6d6650bbd48690954ab01b05ca71ea9c03";
};

export default function PaymentForm() {
  const [level, setLevel] = useState("100");
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();

  if (!currentUser || !currentUser.email) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  const amount = levelPrices[level] * 100;
  const PAYSTACK_PUBLIC_KEY = getPaystackPublicKey();

  const handleSuccess = async (reference) => {
    setIsProcessing(true);
    try {
      await setDoc(doc(db, "payments", reference.reference), {
        uid: currentUser.uid,
        level,
        amount: amount / 100,
        status: "Verified - Pending Approval",
        date: serverTimestamp(),
        reference: reference.reference,
      });
      setIsProcessing(false);
      alert("Payment verified successfully! Temporary receipt ready.");
      setTimeout(() => {
        location.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert("Payment save failed. Contact support.");
    }
  };

  const paystackProps = {
    email: currentUser.email,
    amount,
    publicKey: PAYSTACK_PUBLIC_KEY,
    text: "Pay with Paystack",
    onSuccess: handleSuccess,
    reference: `ref-${currentUser.uid}-${Date.now()}`,
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-xl">Make Payment</h3>
          <p className="text-sm text-gray-500">Select your level and proceed to checkout</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Level Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Your Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border-2 border-gray-200 rounded-xl p-4 w-full text-gray-900 font-medium bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            {Object.keys(levelPrices).map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl} Level - ₦{levelPrices[lvl].toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Summary */}
        <div className="bg-gray-50 rounded-xl p-5 border-2 border-dashed border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              ₦{levelPrices[level].toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Button */}
        {isProcessing ? (
          <button
            disabled
            className="w-full bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 cursor-not-allowed"
          >
            <Loader className="animate-spin" size={22} />
            Processing Payment...
          </button>
        ) : (
          <PaystackButton
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
            {...paystackProps}
          />
        )}

        
      </div>
    </div>
  );
}