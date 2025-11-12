import { useState } from "react";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
