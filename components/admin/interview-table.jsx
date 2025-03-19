"use client";

import { useState, useMemo, useCallback } from "react";
import { formatDate, formatStatus, getStatusColor } from "@/lib/services/interview-service";
import { ChevronDown, ChevronUp, ArrowUpDown, Edit, Trash, MoreHorizontal, Calendar, ChevronLeft, ChevronRight, UserRound, Eye, Link as LinkIcon } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/components/ui/use-toast";

export function InterviewTable({ interviews }) {
  const { toast } = useToast();
  const [sortField, setSortField] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const itemsPerPage = 5;

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInterviews(paginatedInterviews.map(interview => interview.id));
    } else {
      setSelectedInterviews([]);
    }
  };

  const handleSelectInterview = (id) => {
    if (selectedInterviews.includes(id)) {
      setSelectedInterviews(selectedInterviews.filter(interviewId => interviewId !== id));
    } else {
      setSelectedInterviews([...selectedInterviews, id]);
    }
  };

  // Handle actions
  const handleEdit = () => {
    alert(`Edit interview(s): ${selectedInterviews.join(', ')}`);
  };

  const handleDelete = () => {
    alert(`Delete interview(s): ${selectedInterviews.join(', ')}`);
  };

  // This funcction will make the admin copy the link to the candidate's interview page and send to them via email 
  const copyLinkToClipboard = (interview) => {
    const baseUrl = window.location.origin;
    const interviewUrl = `${baseUrl}/interview/${interview.id}`;
    
    navigator.clipboard.writeText(interviewUrl)
      .then(() => {
        toast({
          title: "Link copied!",
          description: `Candidate link for "${interview.title}" copied to clipboard.`,
          variant: "success",
        });
      })
      .catch((error) => {
        console.error('Failed to copy link: ', error);
        toast({
          title: "Failed to copy link",
          description: "Please try again or copy the URL manually.",
          variant: "destructive",
        });
      });
  };

  // Sort interviews
  const sortedInterviews = [...interviews].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle string comparison
    if (typeof aValue === "string") {
      if (sortField === "dateCreated") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedInterviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInterviews = sortedInterviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="w-full">
      {/* Action buttons */}
      {selectedInterviews.length > 0 && (
        <div className="sticky top-0 z-10 flex items-center gap-2 p-2 bg-muted/90 backdrop-blur-sm rounded-t-md">
          <span className="text-sm font-medium">
            {selectedInterviews.length} selected
          </span>
          <div className="flex-1"></div>
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
          >
            <Trash className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-2 sm:px-4 py-3 w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  onChange={handleSelectAll}
                  checked={selectedInterviews.length === paginatedInterviews.length && paginatedInterviews.length > 0}
                  indeterminate={selectedInterviews.length > 0 && selectedInterviews.length < paginatedInterviews.length}
                />
              </th>
              <th
                className="px-2 sm:px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  <span className="whitespace-nowrap">Title</span>
                  {getSortIcon("title")}
                </div>
              </th>
              <th
                className="px-2 sm:px-4 py-3 text-left font-medium cursor-pointer whitespace-nowrap"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  <span>Status</span>
                  {getSortIcon("status")}
                </div>
              </th>
              <th
                className="hidden sm:table-cell px-2 sm:px-4 py-3 text-left font-medium cursor-pointer whitespace-nowrap"
                onClick={() => handleSort("dateCreated")}
              >
                <div className="flex items-center">
                  <span>Date Created</span>
                  {getSortIcon("dateCreated")}
                </div>
              </th>
              <th className="px-2 sm:px-4 py-3 text-right font-medium w-10 sm:w-auto">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedInterviews.length > 0 ? (
              paginatedInterviews.map((interview) => {
                const statusColors = getStatusColor(interview.status);
                const isSelected = selectedInterviews.includes(interview.id);
                return (
                  <tr
                    key={interview.id}
                    className={`bg-card hover:bg-muted/50 transition-colors ${isSelected ? 'bg-muted/50' : ''}`}
                  >
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        checked={isSelected}
                        onChange={() => handleSelectInterview(interview.id)}
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="max-w-[150px] sm:max-w-none truncate">
                        {interview.title}
                      </div>
                      {/* Show date on mobile */}
                      <div className="flex items-center text-xs text-muted-foreground mt-1 sm:hidden">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(interview.dateCreated)}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 sm:px-3 py-1 text-xs rounded-full ${statusColors.bg} ${statusColors.text}`}
                      >
                        {formatStatus(interview.status)}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-2 sm:px-4 py-3 whitespace-nowrap">
                      {formatDate(interview.dateCreated)}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
                          title="Copy candidate access link"
                          onClick={() => copyLinkToClipboard(interview)}
                        >
                          <LinkIcon className="h-4 w-4" />
                          <span className="hidden sm:inline">Copy Link</span>
                        </button>
                        <Link href={`/interview/${interview.id}`} passHref>
                          <button
                            className="p-1 rounded-md hover:bg-muted text-primary"
                            title="Preview as candidate"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          className="p-1 rounded-md hover:bg-muted"
                          onClick={() => handleSelectInterview(interview.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">
                  No interviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border-t border-border bg-card">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, sortedInterviews.length)} of{" "}
            {sortedInterviews.length} interviews
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}