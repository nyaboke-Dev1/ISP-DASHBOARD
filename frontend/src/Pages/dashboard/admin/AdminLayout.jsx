//AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
