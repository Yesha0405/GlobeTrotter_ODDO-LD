import axios from 'axios';

// ==================================================
// 1. API BASE URL Configuration
// ==================================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ==================================================
// 2. AXIOS CLIENT Instance
// ==================================================
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds limit
});

// ==================================================
// 3. ERROR NORMALIZATION Helper
// ==================================================
export function normalizeApiError(error) {
  if (error && error.response) {
    // Server responded with non-2xx status code
    return {
      message: error.response.data?.message || `API Request failed with status ${error.response.status}`,
      status: error.response.status,
      data: error.response.data || null,
    };
  } else if (error && error.request) {
    // Request was dispatched but no response was received
    return {
      message: 'No response received from the backend. Please check your network connection.',
      status: 0,
      data: null,
    };
  } else {
    // Setup issue triggered an error
    return {
      message: error?.message || 'An unknown network error occurred.',
      status: -1,
      data: null,
    };
  }
}

// ==================================================
// 4. TRIP API METHODS
// ==================================================
export async function getTrips() {
  try {
    const response = await apiClient.get('/trips');
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function getTrip(tripId) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  try {
    const response = await apiClient.get(`/trips/${tripId}`);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function createTrip(trip) {
  if (!trip) {
    throw new Error('Trip data is required');
  }
  try {
    const response = await apiClient.post('/trips', trip);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function updateTrip(tripId, updates) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  if (!updates) {
    throw new Error('Updates data is required');
  }
  try {
    const response = await apiClient.put(`/trips/${tripId}`, updates);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function deleteTrip(tripId) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  try {
    const response = await apiClient.delete(`/trips/${tripId}`);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

// ==================================================
// 5. STOP API METHODS
// ==================================================
export async function addStop(tripId, stop) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  if (!stop) {
    throw new Error('Stop data is required');
  }
  try {
    const response = await apiClient.post(`/trips/${tripId}/stops`, stop);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function updateStop(tripId, stopId, updates) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  if (!stopId) {
    throw new Error('Stop ID is required');
  }
  if (!updates) {
    throw new Error('Updates data is required');
  }
  try {
    const response = await apiClient.put(`/trips/${tripId}/stops/${stopId}`, updates);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function deleteStop(tripId, stopId) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  if (!stopId) {
    throw new Error('Stop ID is required');
  }
  try {
    const response = await apiClient.delete(`/trips/${tripId}/stops/${stopId}`);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

// ==================================================
// 6. ACTIVITY API METHODS
// ==================================================
export async function addActivity(tripId, stopId, activity) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  if (!stopId) {
    throw new Error('Stop ID is required');
  }
  if (!activity) {
    throw new Error('Activity data is required');
  }
  try {
    const response = await apiClient.post(`/trips/${tripId}/stops/${stopId}/activities`, activity);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function updateActivity(tripId, stopId, activityId, updates) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  if (!stopId) {
    throw new Error('Stop ID is required');
  }
  if (!activityId) {
    throw new Error('Activity ID is required');
  }
  if (!updates) {
    throw new Error('Updates data is required');
  }
  try {
    const response = await apiClient.put(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, updates);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function deleteActivity(tripId, stopId, activityId) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  if (!stopId) {
    throw new Error('Stop ID is required');
  }
  if (!activityId) {
    throw new Error('Activity ID is required');
  }
  try {
    const response = await apiClient.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

// ==================================================
// 7. EXPENSE API METHODS
// ==================================================
export async function addExpense(tripId, expense) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  if (!expense) {
    throw new Error('Expense data is required');
  }
  try {
    const response = await apiClient.post(`/trips/${tripId}/expenses`, expense);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function deleteExpense(tripId, expenseId) {
  if (!tripId) {
    throw new Error('Trip ID is required');
  }
  if (!expenseId) {
    throw new Error('Expense ID is required');
  }
  try {
    const response = await apiClient.delete(`/trips/${tripId}/expenses/${expenseId}`);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

// ==================================================
// 8. SHARED TRIP METHODS
// ==================================================
export async function getSharedTrip(shareToken) {
  if (!shareToken) {
    throw new Error('Share token is required');
  }
  try {
    const response = await apiClient.get(`/shared/${shareToken}`);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function forkSharedTrip(shareToken) {
  if (!shareToken) {
    throw new Error('Share token is required');
  }
  try {
    const response = await apiClient.post(`/shared/${shareToken}/fork`);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}
