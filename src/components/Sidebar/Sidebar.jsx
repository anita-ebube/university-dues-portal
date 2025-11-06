import React from "react";
import { useAuth } from "../../service/authService";
import SidebarAdmin from "./AdminSidebar";
import SidebarStudent from "./SidebarStudent";

export default function Sidebar({ activeSection, setActiveSection, onLogout }) {
  const { currentUser } = useAuth();

  // You can store user role in your users collection or auth metadata
  const userRole = currentUser?.role || "student"; // fallback to student

  return (
    <>
      {userRole === "admin" ? (
        <SidebarAdmin
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={onLogout}
        />
      ) : (
        <SidebarStudent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={onLogout}
        />
      )}
    </>
  );
}
