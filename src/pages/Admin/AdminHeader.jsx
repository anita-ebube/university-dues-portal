import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../../service/authService";

export default function AdminHeader({ toggleSidebar }) {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-gray-100 transition"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <div className="flex items-center space-x-4">
        <button
          onClick={logout}
          className="flex items-center text-red-600 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-1" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </header>
  );
}
