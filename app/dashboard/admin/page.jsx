"use client";

import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      {/* Main content */}
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
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
    </div>
  );
} 