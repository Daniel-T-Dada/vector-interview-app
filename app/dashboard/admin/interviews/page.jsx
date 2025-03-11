"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { InterviewTable } from "@/components/admin/interview-table";
import { getAllInterviews } from "@/lib/services/interview-service";
import { Plus } from "lucide-react";

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const data = await getAllInterviews();
        setInterviews(data);
        setError(null);
      } catch (err) {
        setError("Failed to load interviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      {/* Main content */}
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Interviews</h1>
            
            {/* Create Interview Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              aria-label="Create new interview"
            >
              <Plus className="h-5 w-5" />
              <span>Create Interview</span>
            </button>
          </div>
          
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
              <p>{error}</p>
            </div>
          )}
          
          {/* Interview table */}
          {!loading && !error && <InterviewTable interviews={interviews} />}
        </div>
      </main>
    </div>
  );
} 