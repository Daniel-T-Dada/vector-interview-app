"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { InterviewTable } from "@/components/admin/interview-table";
import { getAllInterviews } from "@/lib/services/interview-service";
import { Plus, Search, Filter, ChevronDown } from "lucide-react";
import { InterviewsSkeleton } from "@/components/skeletons/interviews-skeleton";

function InterviewsContent() {
  const { data: session } = useSession();
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get user's display name
  const getDisplayName = () => {
    if (!session?.user) return "";
    
    if (session.user.name) {
      // If full name is available, use it
      return session.user.name;
    } else if (session.user.email) {
      // If only email is available, use the part before @
      return session.user.email.split('@')[0];
    }
    
    return "Admin";
  };

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
        // Add a slight delay to show the skeleton for a moment
        setTimeout(() => {
          setLoading(false);
        }, 1000);
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

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return <InterviewsSkeleton />;
  }

  return (
    <main className="p-4 sm:p-6 pt-16 md:pt-6">
      <div className="max-w-7xl mx-auto">
        {/* Header section with responsive layout */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Interviews</h1>
              {session?.user && (
                <p className="text-sm text-muted-foreground mt-1">
                  Managed by {getDisplayName()}
                </p>
              )}
            </div>
            
            {/* Mobile filter toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm rounded-md border border-border bg-card hover:bg-muted"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Create Interview Button - Mobile */}
              <button
                className="flex items-center justify-center p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                aria-label="Create new interview"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Search and filters - Responsive layout */}
          <div className={`grid gap-4 ${showFilters || !showFilters ? 'grid-cols-1 md:grid-cols-12' : 'hidden md:grid md:grid-cols-12'}`}>
            {/* Search input - takes more space on larger screens */}
            <div className="relative md:col-span-5 lg:col-span-6">
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
            
            {/* Status filter - takes less space */}
            <div className="relative md:col-span-3">
              <select
                className="pl-4 pr-8 py-2 w-full rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
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
            
            {/* Create Interview Button - Desktop/Tablet */}
            <div className="hidden md:block md:col-span-4 lg:col-span-3">
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 w-full bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                aria-label="Create new interview"
              >
                <Plus className="h-5 w-5" />
                <span>Create Interview</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {/* No results */}
        {!error && filteredInterviews.length === 0 && (
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
        {!error && filteredInterviews.length > 0 && (
          <div className="overflow-hidden rounded-md border border-border">
            <InterviewTable interviews={filteredInterviews} />
          </div>
        )}
      </div>
    </main>
  );
}

export default function InterviewsPage() {
  return (
    <Suspense fallback={<InterviewsSkeleton />}>
      <InterviewsContent />
    </Suspense>
  );
} 