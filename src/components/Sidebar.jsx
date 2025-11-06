import React, { useState } from "react";
import { useAuth } from "../service/authService";
import { Clock, Download, CreditCard, LogOut, Check, AlertCircle } from 'lucide-react';
import logoSrc from "../assets/logo.png"; 
import { NavLink } from "react-router-dom";
// ... rest of your imports

export default function Sidebar({ onLogout }) {
  const { currentUser } = useAuth();
  const [imgError, setImgError] = useState(false);

  if (!currentUser) return <div className="w-64 flex items-center justify-center">Loading...</div>;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: CreditCard },
    { name: "Profile", path: "/profile", icon: Clock },
  ];

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-green-800 flex items-center justify-center">
          {!imgError ? (
            <img src={logoSrc} alt="UNN Dues logo" onError={() => setImgError(true)} />
          ) : (
            <span className="text-white font-bold">U</span>
          )}
        </div>
        <span className="font-bold text-lg">NACOS Dues</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
