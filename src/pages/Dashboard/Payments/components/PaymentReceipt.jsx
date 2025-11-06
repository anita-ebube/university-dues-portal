import { Download, CheckCircle } from "lucide-react";

export default function PaymentReceipt({ payment, studentInfo, onClose }) {
  const handleDownload = () => {
    const receiptContent = document.getElementById('receipt-content');
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Payment Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .approved-stamp {
              text-align: center;
              color: #059669;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>${receiptContent.innerHTML}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div id="receipt-content">
          <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Official Payment Receipt</h1>
            <p className="text-gray-600">Verified & Approved Transaction Record</p>
            <p className="text-sm text-gray-500 mt-2">Receipt ID: {payment.id}</p>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
              <CheckCircle size={20} /> APPROVED BY ADMIN
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b py-2">
              <span className="font-semibold">Student Name:</span>
              <span>{studentInfo.name}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-semibold">Student ID:</span>
              <span>{studentInfo.studentId}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-semibold">Level:</span>
              <span>{payment.level} Level</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-semibold">Amount:</span>
              <span>₦{payment.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-semibold">Status:</span>
              <span className="bg-green-500 text-white px-2 py-1 rounded">{payment.status}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t">
          <button onClick={handleDownload} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2">
            <Download size={18} /> Download Official Receipt
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
