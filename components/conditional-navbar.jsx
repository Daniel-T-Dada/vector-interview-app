"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // To make sure the candidate does not see the admin navbar and visa versa
  const isAdminDashboard = pathname?.startsWith('/dashboard');
  const isInterviewPage = pathname?.startsWith('/interview');
  
  // Don't show navbar on admin dashboard or interview pages
  if (isAdminDashboard || isInterviewPage) {
    return null;
  }

  return <Navbar />;
} 