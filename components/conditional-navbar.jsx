"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Updated condition to check for the admin dashboard path structure
  // We want to hide navbar only for /dashboard/* but show it for /user-dashboard/*
  const isAdminDashboard = pathname?.startsWith('/dashboard');
  
  // Don't show navbar on admin dashboard pages
  if (isAdminDashboard) {
    return null;
  }

  return <Navbar />;
} 