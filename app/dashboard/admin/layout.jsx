"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function AdminLayoutRedirect({ children }) {
  useEffect(() => {
    redirect("/dashboard");
  }, []);

  return null;
} 