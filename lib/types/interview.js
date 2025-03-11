/**
 * @typedef {Object} Interview
 * @property {string} id - Unique identifier for the interview
 * @property {string} title - Title of the interview
 * @property {InterviewStatus} status - Current status of the interview
 * @property {string} dateCreated - ISO date string when the interview was created
 * @property {string} candidateName - Name of the candidate
 * @property {string} position - Position the candidate is interviewing for
 * @property {string[]} interviewers - Array of interviewer names
 */

/**
 * @typedef {'scheduled'|'completed'|'cancelled'|'pending'} InterviewStatus
 */

/**
 * @typedef {Object} InterviewSortOptions
 * @property {string} field - Field to sort by
 * @property {'asc'|'desc'} direction - Sort direction
 */

/**
 * @typedef {Object} InterviewFilterOptions
 * @property {InterviewStatus} [status] - Filter by status
 * @property {string} [search] - Search term for title or candidate name
 */

// Export as JSDoc types since we're not using TypeScript
export const InterviewTypes = {}; 