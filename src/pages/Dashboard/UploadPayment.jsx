import { useState } from "react";
import { storage, db } from "../../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function UploadPayment() {
  const [formData, setFormData] = useState({
    paymentType: "",
    amount: "",
    transactionId: "",
    level: "",
    file: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("Pending");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return alert("Please upload a payment proof.");

    const fileRef = ref(storage, `payments/${formData.file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, formData.file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => console.error(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "payments"), {
          ...formData,
          fileUrl: downloadURL,
          status: "Pending",
          createdAt: Timestamp.now(),
        });
        alert("Payment proof submitted successfully!");
        setFormData({ paymentType: "", amount: "", transactionId: "", level: "", file: null });
        setUploadProgress(0);
      }
    );
  };

  return (
    <div className="p-6 flex-1 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Upload Payment Proof</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Payment Type</label>
            <select
              name="paymentType"
              onChange={handleChange}
              value={formData.paymentType}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select Payment Type</option>
              <option value="Departmental Due">Departmental Due</option>
              <option value="Faculty Due">Faculty Due</option>
              <option value="NACOS Due">NACOS Due</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="Enter Amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Transaction ID</label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="Enter Transaction ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Level</label>
            <select
              name="level"
              onChange={handleChange}
              value={formData.level}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select Level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Upload Payment Proof</label>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
            className="w-full border p-3 rounded-md"
          />
        </div>

        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <p className="text-yellow-600 font-medium">
          Status: {status} ⏳
        </p>

        <button
          type="submit"
          className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}
