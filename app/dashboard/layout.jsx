"use client";

import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="md:ml-64 min-h-screen">
        {children}
      </div>
    </div>
  );
} 