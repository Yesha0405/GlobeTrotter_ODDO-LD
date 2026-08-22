import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export function normalizeApiError(error) {
  if (error?.response) {
    return {
      message:
        error.response.data?.message ||
        `API request failed (${error.response.status})`,
      status: error.response.status,
      data: error.response.data || null,
    };
  }

  if (error?.request) {
    return {
      message:
        "Backend is not responding. Make sure the Node server is running.",
      status: 0,
      data: null,
    };
  }

  return {
    message: error?.message || "Unknown API error",
    status: -1,
    data: null,
  };
}


// ==================================================
// CITIES
// ==================================================

export async function getCities() {
  try {
    const response = await apiClient.get("/cities");
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


// ==================================================
// TRIPS
// ==================================================

export async function getTrips() {
  try {
    const response = await apiClient.get("/trips");
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


export async function getTrip(tripId) {
  try {
    const response = await apiClient.get(`/trips/${tripId}`);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


export async function createTrip(trip) {
  try {
    const response = await apiClient.post("/trips", trip);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


// ==================================================
// STOPS
// ==================================================

export async function addStop(tripId, stop) {
  try {
    const response = await apiClient.post(
      `/trips/${tripId}/stops`,
      stop
    );

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


// ==================================================
// ACTIVITIES
// ==================================================

export async function getActivitiesByCity(cityId) {
  try {
    const response = await apiClient.get(
      `/activities/city/${cityId}`
    );

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


export async function addActivityToStop(stopId, activity) {
  try {
    const response = await apiClient.post(
      `/activities/stops/${stopId}`,
      activity
    );

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


// ==================================================
// BUDGET
// ==================================================

export async function getTripBudget(tripId) {
  try {
    const response = await apiClient.get(
      `/trips/${tripId}/budget`
    );

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


// ==================================================
// EXPENSES
// ==================================================

export async function addExpense(tripId, expense) {
  try {
    const response = await apiClient.post(
      `/trips/${tripId}/expenses`,
      expense
    );

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


export async function deleteExpense(tripId, expenseId) {
  try {
    const response = await apiClient.delete(
      `/trips/${tripId}/expenses/${expenseId}`
    );

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


export async function deleteStop(tripId, stopId) {
  try {
    const response = await apiClient.delete(
      `/trips/${tripId}/stops/${stopId}`
    );
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


export async function deleteActivity(stopId, activityId) {
  try {
    const response = await apiClient.delete(
      `/activities/stops/${stopId}/activities/${activityId}`
    );
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}


export async function updateActivity(stopId, activityId, activity) {
  try {
    const response = await apiClient.put(
      `/activities/stops/${stopId}/activities/${activityId}`,
      activity
    );
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}