import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../service/authService';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import Sidebar from '../components/Sidebar';

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [studentData, setStudentData] = useState({
    name: '',
    regNo: '',
    department: 'Computer Science',
    level: '',
    photoURL: ''
  });

  const [editData, setEditData] = useState({
    name: '',
    regNo: '',
    department: '',
    level: '',
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!currentUser) return;

      try {
        // Changed from 'students' to 'users' collection
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setStudentData({
            name: data.name || currentUser.displayName || 'N/A',
            regNo: data.regNo || data.email || 'N/A',
            department: data.department || 'Computer Science',
            level: data.level || 'N/A',
            photoURL: data.photoURL || data.profilePicture || currentUser.photoURL || ''
          });
        } else {
          setStudentData(prev => ({
            ...prev,
            name: currentUser.displayName || currentUser.email || 'N/A',
            department: 'Computer Science'
          }));
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [currentUser]);

  // Handle photo upload with Cloudinary
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "student_profile_pics");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dgpzbfi8d/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();

      if (data.secure_url) {
        const imageUrl = data.secure_url;

        // Changed from 'students' to 'users' collection
        await setDoc(
          doc(db, "users", currentUser.uid),
          { 
            photoURL: imageUrl,
            profilePicture: imageUrl // Store in both fields for consistency
          },
          { merge: true }
        );

        setStudentData((prev) => ({ ...prev, photoURL: imageUrl }));
      } else {
        alert("Upload succeeded but no image URL was returned.");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!currentUser) return;

    setIsSaving(true);
    try {
      // Changed from 'students' to 'users' collection
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: editData.name,
        regNo: editData.regNo,
        department: editData.department,
        level: editData.level,
      });

      setStudentData(prev => ({
        ...prev,
        name: editData.name,
        regNo: editData.regNo,
        department: editData.department,
        level: editData.level,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          </div>

          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Profile Picture */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-200">
                    {studentData.photoURL ? (
                      <img 
                        src={studentData.photoURL} 
                        alt={studentData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Name and Reg No */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{studentData.name}</h2>
                  <p className="text-gray-500">{studentData.regNo}</p>
                </div>
              </div>

              {/* Change Photo Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-green-50 hover:bg-green-100 text-green-700 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Change Photo'}
              </button>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Full Name */}
                <div>
                  <label className="text-sm text-gray-500 font-medium block mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full text-gray-900 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="text-gray-900 font-medium">{studentData.name}</div>
                  )}
                </div>

                {/* Registration Number */}
                <div>
                  <label className="text-sm text-gray-500 font-medium block mb-2">Registration Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.regNo}
                      onChange={(e) => setEditData({ ...editData, regNo: e.target.value })}
                      className="w-full text-gray-900 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="text-gray-900 font-medium">{studentData.regNo}</div>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="text-sm text-gray-500 font-medium block mb-2">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.department}
                      onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                      className="w-full text-gray-900 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="text-gray-900 font-medium">{studentData.department}</div>
                  )}
                </div>

                {/* Level */}
                <div>
                  <label className="text-sm text-gray-500 font-medium block mb-2">Level</label>
                  {isEditing ? (
                    <select
                      value={editData.level}
                      onChange={(e) => setEditData({ ...editData, level: e.target.value })}
                      className="w-full text-gray-900 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="">Select Level</option>
                      <option value="100 Level">100 Level</option>
                      <option value="200 Level">200 Level</option>
                      <option value="300 Level">300 Level</option>
                      <option value="400 Level">400 Level</option>
                      <option value="500 Level">500 Level</option>
                    </select>
                  ) : (
                    <div className="text-gray-900 font-medium">{studentData.level}</div>
                  )}
                </div>
              </div>

             

              {/* Action Button */}
              <div className="flex justify-end">
                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-8 rounded-lg font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-700 hover:bg-green-800 text-white py-2.5 px-8 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditData({
                        name: studentData.name,
                        regNo: studentData.regNo,
                        department: studentData.department,
                        level: studentData.level,
                      });
                      setIsEditing(true);
                    }}
                    className="bg-green-700 hover:bg-green-800 text-white py-2.5 px-8 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}