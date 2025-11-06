import { CheckCircle, Download } from "lucide-react";

export default function OfficialReceipt({ payment, studentInfo, onClose }) {
  const handleDownload = () => {
    const content = document.getElementById("official-receipt-content");
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><body>${content.innerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div id="official-receipt-content">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-700">Official Payment Receipt</h1>
            <p className="text-sm text-gray-600">Approved Transaction Record</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between"><b>Student:</b><span>{studentInfo.name}</span></div>
            <div className="flex justify-between"><b>Level:</b><span>{payment.level}</span></div>
            <div className="flex justify-between"><b>Amount:</b><span>₦{payment.amount?.toLocaleString()}</span></div>
            <div className="flex justify-between"><b>Status:</b><span>{payment.status}</span></div>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <button onClick={handleDownload} className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2">
            <Download size={18} /> Download
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
