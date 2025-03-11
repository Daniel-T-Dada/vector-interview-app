"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function UsersRedirect() {
  useEffect(() => {
    redirect("/user-dashboard/users");
  }, []);

  return null;
} 