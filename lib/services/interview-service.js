import { interviews } from "@/lib/data/interviews";

// Mock questions data for interviews
export const mockQuestions = {
  "int-001": [
    { id: "q1", text: "Tell us about your experience with React.js and Next.js?", timeLimit: 120 },
    { id: "q2", text: "What's your approach to responsive design?", timeLimit: 120 },
    { id: "q3", text: "How do you handle state management in large applications?", timeLimit: 120 },
    { id: "q4", text: "Describe a challenging project you worked on and how you overcame obstacles.", timeLimit: 120 },
    { id: "q5", text: "How do you stay updated with the latest frontend technologies?", timeLimit: 120 }
  ],
  "int-002": [
    { id: "q1", text: "What design tools are you most comfortable with?", timeLimit: 120 },
    { id: "q2", text: "Walk us through your UX design process.", timeLimit: 120 },
    { id: "q3", text: "How do you incorporate user feedback into your designs?", timeLimit: 120 },
    { id: "q4", text: "Describe a design project where you had to make significant compromises.", timeLimit: 120 }
  ],
  "int-003": [
    { id: "q1", text: "Explain your experience with Node.js and Express.", timeLimit: 120 },
    { id: "q2", text: "How do you approach database design?", timeLimit: 120 },
    { id: "q3", text: "Describe your experience with microservices architecture.", timeLimit: 120 },
    { id: "q4", text: "How do you ensure the security of a backend system?", timeLimit: 120 }
  ],
  // Default questions for interviews without specific questions
  "default": [
    { id: "q1", text: "Tell us about your relevant experience.", timeLimit: 120 },
    { id: "q2", text: "What makes you a good fit for this position?", timeLimit: 120 },
    { id: "q3", text: "Describe a challenge you've faced and how you overcame it.", timeLimit: 120 },
    { id: "q4", text: "What are your professional goals?", timeLimit: 120 },
    { id: "q5", text: "Do you have any questions for us?", timeLimit: 120 }
  ]
};

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
  const interview = interviews.find(interview => interview.id === id);
  
  if (!interview) return null;
  
  // Get the actual interview data from the API
  try {
    const response = await fetch(`/api/interviews/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch interview data');
    }
    const result = await response.json();
    
    // Check if API returned success and data
    if (result && result.success && result.data) {
      // Ensure questions array exists, or use mock questions
      const interviewData = result.data;
      if (!interviewData.questions || !Array.isArray(interviewData.questions) || interviewData.questions.length === 0) {
        return {
          ...interviewData,
          questions: mockQuestions[id] || mockQuestions.default
        };
      }
      return interviewData;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error fetching interview:', error);
    // Fallback to mock data if API fails
    return {
      ...interview,
      questions: mockQuestions[id] || mockQuestions.default
    };
  }
}

/**
 * Create a new interview
 * @param {Object} interviewData - Interview data to create
 * @returns {Promise<Object>} Created interview object
 */
export async function createInterview(interviewData) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const response = await fetch('/api/interviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interviewData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create interview');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating interview:', error);
    throw error;
  }
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

/**
 * Save candidate information for an interview
 * @param {string} interviewId - Interview ID
 * @param {string} candidateName - Candidate's name
 * @returns {Promise<Object>} Result object with success status
 */
export async function saveCandidateInfo(interviewId, candidateName) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // In a real app, this would save to a database
    // For demo purposes, we'll just use sessionStorage
    const key = `interview_${interviewId}_candidate`;
    sessionStorage.setItem(key, candidateName);
    
    return { success: true };
  } catch (error) {
    console.error('Error saving candidate info:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get candidate information for an interview
 * @param {string} interviewId - Interview ID
 * @returns {string|null} Candidate name or null if not found
 */
export function getCandidateInfo(interviewId) {
  try {
    const key = `interview_${interviewId}_candidate`;
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error('Error getting candidate info:', error);
    return null;
  }
} 





