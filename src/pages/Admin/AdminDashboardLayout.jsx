import { useState } from "react";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import { Outlet } from "react-router-dom";
export default function AdminDashboardLayout() {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return  (
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar />
          <main className="lg:ml-64 lg:mt-0 mt-20 flex-1 overflow-y-auto">
            <div className="p-4 md:p-8">
              <Outlet />
            </div>
          </main>
        </div>
  );
}
