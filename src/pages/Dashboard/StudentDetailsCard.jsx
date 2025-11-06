import { useState, useEffect } from 'react';
import { useAuth } from '../../service/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { User, GraduationCap } from 'lucide-react';
import profileBg from '../../assets/profile-bg.png'; 

function StudentDetailsCard() {
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const studentDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (studentDoc.exists()) {
          const userData = studentDoc.data();
          setStudentData({
            name: userData.name || 'N/A',
            regNo: userData.regNo || 'N/A',
            level: userData.level || 'N/A',
            department: userData.department || 'N/A',
            profilePicture: userData.profilePicture || null
          });
        } else {
          setStudentData({
            name: currentUser.displayName || currentUser.email || 'N/A',
            regNo: 'N/A',
            level: 'N/A',
            department: 'N/A',
            profilePicture: null
          });
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setStudentData({
          name: currentUser.displayName || currentUser.email || 'N/A',
          regNo: 'N/A',
          level: 'N/A',
          department: 'N/A',
          profilePicture: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-gray-500 ml-3">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  return (
    <div className="bg-white to-emerald-50 rounded-2xl shadow-lg overflow-hidden mb-8 border border-green-100">
      <div className="flex flex-col md:flex-row">
        {/* Profile Picture Section with image background */}
        <div
          className="md:w-80 p-8 flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            backgroundImage: `url(${profileBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            {studentData.profilePicture ? (
              <div className="relative">
                <img 
                  src={studentData.profilePicture} 
                  alt={studentData.name}
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center border-4 border-white shadow-2xl">
                  <User className="w-20 h-20 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          
            <div className="mt-6 text-center">
              <h3 className="text-white font-bold text-xl">{studentData.name}</h3>
              <p className="text-green-100 text-sm mt-1">{studentData.regNo}</p>
            </div>
          </div>
        </div>
        
        {/* Student Details Section */}
        <div className="flex-1 p-8">
          <div className="flex items-center mb-6">
            <GraduationCap className="w-6 h-6 text-green-700 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                  <p className="text-gray-900 font-semibold text-lg truncate">{studentData.name}</p>
                </div>
              </div>
            </div>

            {/* Registration Number Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Registration No.</p>
                  <p className="text-gray-900 font-semibold text-lg truncate">{studentData.regNo}</p>
                </div>
              </div>
            </div>

            {/* Level Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current Level</p>
                  <p className="text-gray-900 font-semibold text-lg truncate">{studentData.level}</p>
                </div>
              </div>
            </div>

            {/* Department Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Department</p>
                  <p className="text-gray-900 font-semibold text-lg truncate">{studentData.department}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailsCard;