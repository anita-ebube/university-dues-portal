import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { useAuth } from "../../../../service/authService";
import { PaystackButton } from "react-paystack";
import { levelPrices } from "../utils/levelPrices";
import { Loader } from "lucide-react";

// Fixed: Use import.meta.env for Vite instead of process.env
const getPaystackPublicKey = () => {
  return import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_c110ed6d6650bbd48690954ab01b05ca71ea9c03";
};

export default function PaymentForm() {
  const [level, setLevel] = useState("100");
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser || !currentUser.email) return <div>Loading...</div>;

  const amount = levelPrices[level] * 100; // kobo

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
      alert("Payment verified successfully! Temporary receipt ready.");
      // Use React Router navigation - refresh the current page
      navigate(0);
    } catch (error) {
      console.error(error);
      alert("Payment save failed. Contact support.");
    } finally {
      setIsProcessing(false);
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-800 mb-4 text-lg">Make a New Payment</h3>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full"
            disabled={isProcessing}
          >
            {Object.keys(levelPrices).map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl} Level - ₦{levelPrices[lvl].toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {isProcessing ? (
          <button className="bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <Loader className="animate-spin" size={18} /> Processing...
          </button>
        ) : (
          <PaystackButton
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            {...paystackProps}
          />
        )}
      </div>
    </div>
  );
}