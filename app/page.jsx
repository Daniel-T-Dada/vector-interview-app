"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is authenticated, redirect to the dashboard
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Vector Interview</h1>
      <p className="text-xl mb-8 max-w-2xl">
        A comprehensive platform for managing and conducting interviews efficiently.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/auth/signup">Create Account</Link>
        </Button>
      </div>
    </div>
  );
} 