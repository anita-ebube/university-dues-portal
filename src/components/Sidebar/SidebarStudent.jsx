import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Clock, CreditCard, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../service/authService"; 
import logo from "../../assets/logo.png";

export default function SidebarStudent() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [imgError, setImgError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser)
    return <div className="w-64 flex items-center justify-center">Loading...</div>;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: CreditCard },
    { name: "Profile", path: "/dashboard/profile", icon: Clock },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col h-screen
        `}
      >
        {/* Sidebar Header (Logo + Hamburger inside) */}
        <div className="p-6 border-b flex items-center justify-between">
          {/* Logo + Text */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-green-800 flex items-center justify-center">
              {!imgError ? (
                <img
                  src={logo}
                  alt="UNN Dues logo"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold">U</span>
              )}
            </div>
            <span className="font-bold text-lg">NACOS Dues</span>
          </div>

          {/* Hamburger inside logo bar */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section & Logout */}
        <div className="p-4 border-t border-gray-200">
          {/* User Info */}
          <div className="mb-3 px-4 py-2">
            <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button (fixed when sidebar is closed) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-white border border-gray-200 shadow-md hover:bg-gray-50 transition-all ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}