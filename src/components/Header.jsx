import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">
              UNN Dues Verification Portal
            </span>
            <span className="font-semibold text-gray-900 sm:hidden">
              UNN Portal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-green-700 transition font-medium"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-green-700 transition font-medium"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-green-700 transition font-medium"
            >
              Contact
            </Link>
            <Link 
              to="/login"
              className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register"
              className="border border-green-700 text-green-700 px-4 py-2 rounded-md hover:bg-green-50 transition font-medium"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 space-y-3 border-t border-gray-100">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="block px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition text-center font-medium"
              onClick={toggleMenu}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block px-4 py-2 border border-green-700 text-green-700 rounded-md hover:bg-green-50 transition text-center font-medium"
              onClick={toggleMenu}
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;