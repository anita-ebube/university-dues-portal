import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../../service/authService";

export default function AdminHeader({ toggleSidebar }) {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4 sticky top-0 z-20">
      {/* Menu button - Mobile only */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Spacer for desktop to push logout to the right */}
      <div className="hidden lg:block flex-1"></div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        <button
          onClick={logout}
          className="flex items-center text-red-600 hover:text-red-700 transition"
        >
          <LogOut className="w-5 h-5 mr-1" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </header>
  );
}