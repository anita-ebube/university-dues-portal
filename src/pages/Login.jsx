import { useState } from "react";
import { LogIn, Lock, Eye, EyeOff, AlertCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ regNo: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const regNoToEmail = (regNo) => {
    const cleanRegNo = regNo.replace(/\//g, '').trim();
    return `${cleanRegNo}@cs.unn.edu.ng`;
  };

  const validateRegNo = (regNo) => {
    const regNoPattern = /^\d{4}\/?\d{6}$/;
    return regNoPattern.test(regNo);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'regNo') {
      let formatted = value.replace(/[^\d]/g, '');
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
    if (loading) return;

    setLoading(true);
    setError('');

    if (!validateRegNo(formData.regNo)) {
      setError('Invalid registration number format. Use format: 2020/241762');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
  const email = regNoToEmail(formData.regNo);

  // Set persistence according to "Remember me"
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence
  );

  // Sign in with firebase
  const userCredential = await signInWithEmailAndPassword(auth, email, formData.password);
  const user = userCredential.user;

  console.log('Login successful:', user);

  // 🔹 Get the user's Firestore data
  const userDocRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    console.log("✅ Firestore user data:", userData);

    // 🔹 Redirect based on role
    if (userData.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (userData.role === "student") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/unauthorized", { replace: true });
    }
  } else {
    console.error("❌ No Firestore user data found for:", user.uid);
    setError("User data not found. Please contact support.");
  }

  setLoading(false);

    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);

      let errorMessage = 'An error occurred during login';

      // Map common firebase auth error codes
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this registration number';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid registration number/email';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection';
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">UNN Dues Verification System</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Registration Number */}
          <div>
            <label htmlFor="regNo" className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="regNo"
                name="regNo"
                value={formData.regNo}
                onChange={handleInputChange}
                placeholder="e.g., 2020/249042"
                maxLength={11}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                required
                aria-describedby="regNo-format"
              />
            </div>
            <p id="regNo-format" className="text-xs text-gray-500 mt-1">
              Format: YYYY/XXXXXX
            </p>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-green-600 hover:text-green-700 font-medium transition"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-green-600 font-semibold hover:text-green-700 transition"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            University of Nigeria, Nsukka<br />
            Computer Science Department
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;