"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { InterviewTable } from "@/components/admin/interview-table";
import { getAllInterviews } from "@/lib/services/interview-service";
import { Plus, Search, Filter } from "lucide-react";

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const data = await getAllInterviews();
        setInterviews(data);
        setFilteredInterviews(data);
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

  // Filter interviews based on search term and status filter
  useEffect(() => {
    let result = interviews;
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(interview => 
        interview.title.toLowerCase().includes(lowerSearchTerm) ||
        interview.candidateName.toLowerCase().includes(lowerSearchTerm) ||
        interview.position.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(interview => interview.status === statusFilter);
    }
    
    setFilteredInterviews(result);
  }, [searchTerm, statusFilter, interviews]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      {/* Main content */}
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold">Interviews</h1>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Search and filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search interviews..."
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <div className="relative">
                  <select
                    className="pl-4 pr-8 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Create Interview Button */}
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                aria-label="Create new interview"
              >
                <Plus className="h-5 w-5" />
                <span>Create Interview</span>
              </button>
            </div>
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
          
          {/* No results */}
          {!loading && !error && filteredInterviews.length === 0 && (
            <div className="bg-muted/50 border border-border rounded-md p-8 text-center">
              <p className="text-muted-foreground">No interviews found matching your search criteria.</p>
              {searchTerm || statusFilter !== "all" ? (
                <button
                  className="mt-4 text-primary hover:underline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          )}
          
          {/* Interview table */}
          {!loading && !error && filteredInterviews.length > 0 && (
            <InterviewTable interviews={filteredInterviews} />
          )}
        </div>
      </main>
    </div>
  );
} 