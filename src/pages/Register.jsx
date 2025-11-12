import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, User, Lock, Eye, EyeOff, AlertCircle, IdCard, CreditCard } from 'lucide-react';
import Layout from '../components/Layout'
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Convert registration number to email format
  const regNoToEmail = (regNo) => {
    // Remove any slashes or special characters
    const cleanRegNo = regNo.replace(/\//g, '');
    return `${cleanRegNo}@cs.unn.edu.ng`;
  };


  const validateRegNo = (regNo) => {
    const regNoPattern = /^\d{4}\/?\d{6}$/;
    return regNoPattern.test(regNo);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format registration number as user types
    if (name === 'regNo') {
      let formatted = value.replace(/[^\d]/g, ''); // Remove non-digits
      if (formatted.length > 4) {
        formatted = formatted.slice(0, 4) + '/' + formatted.slice(4, 10);
      }
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!validateRegNo(formData.regNo)) {
      setError('Invalid registration number format. Use format: 2020/241842');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Convert registration number to email
      const email = regNoToEmail(formData.regNo);
      
      // Create user account with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        formData.password
      );
      
      const user = userCredential.user;
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        regNo: formData.regNo,
        email: email,
        department: 'Computer Science',
        role: 'student',
        createdAt: new Date().toISOString(),
        verified: false
      });
      
      setLoading(false);
      setSuccess('Account created successfully! Redirecting to login...');
      navigate('/login');
      // Clear form
      setFormData({
        name: '',
        regNo: '',
        password: '',
        confirmPassword: ''
      });
      

    } catch (err) {
      setLoading(false);
      
      // Handle Firebase errors
      let errorMessage = 'An error occurred during registration';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This registration number is already registered';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection';
      }
      
      setError(errorMessage);
      console.error('Registration error:', err);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen py-8 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">UNN Computer Science Department</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2 text-green-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="regNo"
                  value={formData.regNo}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020/241842"
                  maxLength={11}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format: YYYY/XXXXXX (e.g., 2020/241842)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-green-600 font-semibold hover:text-green-700 transition"
              >
                Login
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By registering, you agree to the UNN Dues Verification System terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;