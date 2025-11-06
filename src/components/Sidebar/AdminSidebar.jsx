import { Home, Users, CreditCard, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

const links = [
  { name: "Dashboard", icon: Home, path: "/admin" },
  { name: "Students", icon: Users, path: "/admin/students" },
  { name: "Payments", icon: CreditCard, path: "/admin/payments" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminSidebar({ isOpen }) {
  return (
    <aside
      className={`bg-green-700 text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
    >
      <div className="flex items-center justify-center py-6 border-b border-green-600">
        <img src={logo} alt="logo" className="w-10 h-10" />
      </div>

      <nav className="flex-1 mt-6 space-y-2">
        {links.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-5 py-3 rounded-lg transition ${
                isActive ? "bg-green-600" : "hover:bg-green-800"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {isOpen && <span className="ml-3 text-sm font-medium">{name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
