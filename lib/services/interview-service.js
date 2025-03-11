import { interviews } from "@/lib/data/interviews";

/**
 * Get all interviews
 * @returns {Promise<Array>} Array of interview objects
 */
export async function getAllInterviews() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return interviews;
}

/**
 * Get interview by ID
 * @param {string} id - Interview ID
 * @returns {Promise<Object|null>} Interview object or null if not found
 */
export async function getInterviewById(id) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return interviews.find(interview => interview.id === id) || null;
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get status badge color
 * @param {string} status - Interview status
 * @returns {Object} Object with background and text color classes
 */
export function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-800 dark:text-blue-300'
      };
    case 'completed':
      return {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-300'
      };
    case 'cancelled':
      return {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-300'
      };
    case 'pending':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-800 dark:text-yellow-300'
      };
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-800 dark:text-gray-300'
      };
  }
}

/**
 * Format status for display
 * @param {string} status - Interview status
 * @returns {string} Formatted status string
 */
export function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
} 