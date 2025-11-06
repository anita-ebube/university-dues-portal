// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="font-semibold text-white">UNN Portal</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Streamlining dues verification for University of Nigeria, Nsukka students and administrators.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-green-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-green-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-green-400 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm hover:text-green-400 transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/student-verification" className="text-sm hover:text-green-400 transition">
                  Student Verification
                </Link>
              </li>
              <li>
                <Link to="/admin-portal" className="text-sm hover:text-green-400 transition">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/receipt-check" className="text-sm hover:text-green-400 transition">
                  Receipt Check
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="text-sm hover:text-green-400 transition">
                  Downloads
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="text-green-400 mt-1 shrink-0" />
                <span className="text-sm">University of Nigeria, Nsukka, Enugu State</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-green-400 shrink-0" />
                <a href="mailto:support@unnportal.edu.ng" className="text-sm hover:text-green-400 transition">
                  support@unnportal.edu.ng
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-green-400 shrink-0" />
                <a href="tel:+2348012345678" className="text-sm hover:text-green-400 transition">
                  +234 801 234 5678
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} UNN Dues Verification Portal. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-green-400 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-green-400 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;