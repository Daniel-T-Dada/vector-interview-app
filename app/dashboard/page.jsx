"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { Suspense } from "react";

function DashboardContent() {
  const { data: session, status } = useSession();
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    let timeGreeting = "Hello";
    
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 18) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";
    
    setGreeting(timeGreeting);

    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Get user's first name for a more personalized greeting
  const getFirstName = () => {
    if (!session?.user?.name) return "";
    
    // Split the name and get the first part
    const nameParts = session.user.name.split(" ");
    return nameParts[0];
  };

  if (status === "loading" || isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <main className="p-6 pt-16 md:pt-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          {status === "authenticated" && session?.user && (
            <p className="text-lg text-muted-foreground">
              {greeting}, <span className="font-medium">{getFirstName() || session.user.email}</span>
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard cards */}
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-xl font-semibold mb-2">Total Interviews</h2>
            <p className="text-3xl font-bold">24</p>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-xl font-semibold mb-2">Scheduled</h2>
            <p className="text-3xl font-bold">12</p>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-xl font-semibold mb-2">Completed</h2>
            <p className="text-3xl font-bold">8</p>
          </div>
        </div>
        
        <div className="mt-8 bg-card rounded-lg shadow p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="font-medium">Frontend Developer Interview</p>
                <p className="text-sm text-muted-foreground">Scheduled for tomorrow</p>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Scheduled
              </span>
            </div>
            
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="font-medium">UX Designer Interview</p>
                <p className="text-sm text-muted-foreground">Completed yesterday</p>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Completed
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Product Manager Interview</p>
                <p className="text-sm text-muted-foreground">Scheduled for next week</p>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Scheduled
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
} 