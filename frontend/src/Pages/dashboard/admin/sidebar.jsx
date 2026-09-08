import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Menu,
  X,
  Home,
  Users,
  Truck,
  DollarSign,
  Bell,
  BookOpen,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/admin/dashboard", label: "Overview", icon: Home },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/transport", label: "Transport", icon: Truck },
    { to: "/admin/funds", label: "Funds", icon: DollarSign },
    { to: "/admin/notifications", label: "Notifications", icon: Bell },
    { to: "/admin/messages", label: "Messages", icon: MessageSquare },
    { to: "/admin/seed-students", label: "Seed Students", icon: BookOpen },
    { to: "/admin/academic-insights", label: "Insights", icon: BookOpen },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: open ? 230 : 70 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0f172a] text-white flex flex-col shadow-lg z-50 min-h-screen"
      >
        {/* Top Section */}
        <div className="flex items-center justify-between p-4 border-b border-blue-600">
          <h2
            className={`text-white font-bold text-lg transition-all duration-300 ${
              !open && "opacity-0 hidden"
            }`}
          >
            Edu-Guardian
          </h2>
          <button
            onClick={() => setOpen(!open)}
            className="text-white focus:outline-none"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex-1 flex flex-col px-2 space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#226eeb] text-white"
                    : "text-gray-200 hover:bg-[#38BDF8]/20"
                }`
              }
            >
              <Icon size={20} />
              {open && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section at Bottom */}
        <div className="px-4 border-t border-blue-600 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 mb-24 text-sm text-gray-200 rounded-lg hover:bg-red-600/80 transition-all w-full"
          >
            <LogOut size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
