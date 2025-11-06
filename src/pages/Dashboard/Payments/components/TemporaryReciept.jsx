import { Clock, Download, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function TemporaryReceipt({ payment, studentInfo, onClose }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      // Fetch user details from storage
      const userKey = `user:${studentInfo.id || studentInfo.email}`;
      const result = await window.storage.get(userKey);
      
      if (result && result.value) {
        setUserData(JSON.parse(result.value));
      } else {
        // Fallback to studentInfo if storage fetch fails
        setUserData(studentInfo);
      }
    } catch (error) {
      console.log('Using provided student info:', error);
      setUserData(studentInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const content = document.getElementById("temp-receipt-content");
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .receipt { max-width: 800px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="receipt">${content.innerHTML}</div>
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 250);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  const displayData = userData || studentInfo;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-end p-4 pb-0">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 pt-4">
          <div id="temp-receipt-content" className="bg-gray-50 p-8 rounded-lg">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-800 rounded flex items-center justify-center">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Temporary Payment Receipt</h1>
                <p className="text-xs text-gray-500">UNN Dues Verification System</p>
              </div>
            </div>

            {/* Student Information Section */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Student Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Student Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {displayData.name  || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Registration Number</p>
                  <p className="text-sm font-medium text-gray-800">
                    {displayData.regNo || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Academic Level</p>
                  <p className="text-sm font-medium text-gray-800">
                    {payment.level || displayData.level || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="text-sm font-medium text-gray-800">
                    Computer Science
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Payment Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-500">Payment Type</span>
                  <span className="text-sm font-medium text-gray-800">
                    NACOS Dues
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-500">Amount Paid</span>
                  <span className="text-sm font-bold text-gray-900">
                    ₦ {(payment.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-500">Transaction Date</span>
                  <span className="text-sm font-medium text-gray-800">
                    {payment.date ? new Date(payment.date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }) : new Date().toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-xs text-gray-500">Payment Status</span>
                  <span className="text-sm font-medium text-yellow-600 flex items-center gap-1">
                    <Clock size={14} /> Pending Approval
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button 
              onClick={handleDownload} 
              className="flex-1 bg-green-700 text-white px-4 py-3 rounded-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Download size={18} /> Download Receipt
            </button>
            <button 
              onClick={onClose} 
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}