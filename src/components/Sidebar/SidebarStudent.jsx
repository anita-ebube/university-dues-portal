import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../service/authService";
import logoSrc from "../../assets/logo.png";
import { Clock, CreditCard, LogOut } from "lucide-react";

export default function SidebarStudent() {
  const { currentUser, logout } = useAuth();
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  if (!currentUser)
    return <div className="w-64 flex items-center justify-center">Loading...</div>;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: CreditCard, end: true }, // Add end: true
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

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col fixed left-0 top-0 h-screen">
      {/* Logo */}
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-green-800 flex items-center justify-center">
          {!imgError ? (
            <img
              src={logoSrc}
              alt="UNN Dues logo"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-white font-bold">U</span>
          )}
        </div>
        <span className="font-bold text-lg">NACOS Dues</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {navItems.map(({ name, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end} // Add this prop
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
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
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}