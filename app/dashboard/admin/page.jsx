"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function AdminRedirect() {
  useEffect(() => {
    redirect("/dashboard");
  }, []);

  return null;
} 