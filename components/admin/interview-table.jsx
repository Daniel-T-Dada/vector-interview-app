"use client";

import { useState } from "react";
import { formatDate, formatStatus, getStatusColor } from "@/lib/services/interview-service";
import { ChevronDown, ChevronUp, ArrowUpDown, Edit, Trash, MoreHorizontal } from "lucide-react";

export function InterviewTable({ interviews }) {
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
        <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-md">
          <span className="text-sm font-medium">
            {selectedInterviews.length} selected
          </span>
          <div className="flex-1"></div>
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  onChange={handleSelectAll}
                  checked={selectedInterviews.length === paginatedInterviews.length && paginatedInterviews.length > 0}
                  indeterminate={selectedInterviews.length > 0 && selectedInterviews.length < paginatedInterviews.length}
                />
              </th>
              <th
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  Title
                  {getSortIcon("title")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon("status")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSort("dateCreated")}
              >
                <div className="flex items-center">
                  Date Created
                  {getSortIcon("dateCreated")}
                </div>
              </th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
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
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        checked={isSelected}
                        onChange={() => handleSelectInterview(interview.id)}
                      />
                    </td>
                    <td className="px-4 py-3">{interview.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${statusColors.bg} ${statusColors.text}`}
                      >
                        {formatStatus(interview.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(interview.dateCreated)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="p-1 rounded-md hover:bg-muted"
                        onClick={() => handleSelectInterview(interview.id)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
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
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, sortedInterviews.length)} of{" "}
            {sortedInterviews.length} interviews
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}