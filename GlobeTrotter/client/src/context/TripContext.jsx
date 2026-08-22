import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";

import {
  getTrips,
  getTrip,
  getCities,
  createTrip as apiCreateTrip,
  addStop as apiAddStop,
  addActivityToStop as apiAddActivity,
  getTripBudget,
  addExpense as apiAddExpense,
  deleteExpense as apiDeleteExpense
} from "../services/api";

import { toISODate } from "../utils/date";

const TripContext = createContext(null);


// ==================================================
// HELPERS
// ==================================================

function getTripStatus(startDate, endDate) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (today < start) return "upcoming";
  if (today > end) return "completed";

  return "ongoing";
}


// ==================================================
// NORMALIZE ACTIVITY
// ==================================================

function normalizeActivity(activity) {
  return {
    id: String(activity.id),

    activityId: activity.activity_id,

    name: activity.name,

    type:
      activity.category || "Other",

    time: activity.start_time
      ? String(activity.start_time).slice(0, 5)
      : "",

    duration:
      Number(activity.duration_hours || 0) * 60,

    price:
      Number(activity.estimated_cost || 0),

    description:
      activity.description || "",

    date:
      toISODate(activity.activity_date)
  };
}


// ==================================================
// NORMALIZE TRIP
// ==================================================

function normalizeTrip(detail, budgetData) {
  const backendTrip = detail.trip;

  const activities =
    detail.activities || [];

  const stops =
    (detail.stops || []).map((stop) => ({
      id: String(stop.id),

      cityId: stop.city_id,

      location: stop.city_name,

      date:
        toISODate(stop.start_date),

      endDate:
        toISODate(stop.end_date),

      transport: "Flight",

      notes: "",

      activities:
        activities
          .filter(
            (activity) =>
              activity.trip_stop_id === stop.id
          )
          .map(normalizeActivity)
    }));


  const expenses =
    (detail.expenses || []).map(
      (expense) => ({
        id: String(expense.id),

        title:
          expense.description ||
          expense.category ||
          "Expense",

        category:
          expense.category,

        amount:
          Number(expense.amount || 0),

        date:
          expense.created_at
            ? toISODate(
                expense.created_at
              )
            : ""
      })
    );


  const destination =
    stops.length > 0
      ? stops[0].location
      : backendTrip.description ||
        "Trip";


  return {
    id:
      String(backendTrip.id),

    title:
      backendTrip.name,

    destination,

    startDate:
      toISODate(
        backendTrip.start_date
      ),

    endDate:
      toISODate(
        backendTrip.end_date
      ),

    status:
      getTripStatus(
        backendTrip.start_date,
        backendTrip.end_date
      ),

    budget:
      Number(
        backendTrip.budget || 0
      ),

    currency: "INR",

    travelers: 1,

    coverImage:
      stops[0]?.image_url || null,

    shareToken:
      backendTrip.share_token,

    isPublic:
      Boolean(
        backendTrip.is_public
      ),

    stops,

    expenses,

    budgetData:
      budgetData?.budget || null
  };
}


// ==================================================
// PROVIDER
// ==================================================

export function TripProvider({
  children
}) {

  const [trips, setTrips] =
    useState([]);

  const [cities, setCities] =
    useState([]);

  const [activeTripId, setActiveTripId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  // ==================================================
  // LOAD ONE TRIP
  // ==================================================

  const loadTrip =
    useCallback(
      async (tripId) => {

        const [
          detail,
          budget
        ] = await Promise.all([
          getTrip(tripId),
          getTripBudget(tripId)
        ]);

        return normalizeTrip(
          detail,
          budget
        );
      },
      []
    );


  // ==================================================
  // LOAD ALL TRIPS
  // ==================================================

  const loadTrips =
    useCallback(
      async () => {

        setLoading(true);
        setError(null);

        try {

          const response =
            await getTrips();

          const backendTrips =
            response.trips || [];

          const detailedTrips =
            await Promise.all(
              backendTrips.map(
                (trip) =>
                  loadTrip(trip.id)
              )
            );

          setTrips(
            detailedTrips
          );

        } catch (err) {

          console.error(err);

          setError(
            err.message ||
            "Failed to connect to backend"
          );

        } finally {

          setLoading(false);

        }
      },
      [loadTrip]
    );


  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {

    const initialize =
      async () => {

        try {

          const cityResponse =
            await getCities();

          setCities(
            cityResponse.cities || []
          );

          await loadTrips();

        } catch (err) {

          console.error(err);

          setError(
            err.message ||
            "Failed to initialize application"
          );

          setLoading(false);
        }
      };

    initialize();

  }, [loadTrips]);


  // ==================================================
  // ACTIVE TRIP
  // ==================================================

  const activeTrip =
    useMemo(() => {

      if (!activeTripId) {
        return null;
      }

      return trips.find(
        (trip) =>
          trip.id ===
          String(activeTripId)
      ) || null;

    }, [
      trips,
      activeTripId
    ]);


  const setActiveTrip =
    useCallback(
      (tripId) => {

        setActiveTripId(
          String(tripId)
        );

      },
      []
    );


  // ==================================================
  // CREATE TRIP
  // ==================================================

  const addTrip =
    useCallback(
      async (tripData) => {

        const response =
          await apiCreateTrip({

            name:
              tripData.title,

            description:
              tripData.destination || "",

            start_date:
              tripData.startDate,

            end_date:
              tripData.endDate,

            budget:
              Number(
                tripData.budget || 0
              )
          });


        const createdTrip =
          await loadTrip(
            response.trip.id
          );


        setTrips(
          (prev) => [
            ...prev,
            createdTrip
          ]
        );


        setActiveTripId(
          String(
            response.trip.id
          )
        );


        return createdTrip;

      },
      [loadTrip]
    );


  // ==================================================
  // ADD STOP
  // ==================================================

  const addStopToTrip =
    useCallback(
      async (
        tripId,
        stop
      ) => {

        const cityName =
          stop.location
            .trim()
            .toLowerCase();


        const city =
          cities.find(
            (c) =>
              c.name
                .toLowerCase()
                .trim() ===
              cityName
          );


        if (!city) {

          throw new Error(
            `City "${stop.location}" was not found in the database.`
          );
        }


        await apiAddStop(
          tripId,
          {
            city_id:
              city.id,

            start_date:
              stop.date,

            end_date:
              stop.endDate ||
              stop.date
          }
        );


        const updatedTrip =
          await loadTrip(
            tripId
          );


        setTrips(
          (prev) =>
            prev.map(
              (trip) =>
                trip.id ===
                String(tripId)
                  ? updatedTrip
                  : trip
            )
        );


        return updatedTrip;

      },
      [
        cities,
        loadTrip
      ]
    );


  // ==================================================
  // ADD ACTIVITY
  // ==================================================

  const addActivityToStop =
    useCallback(
      async (
        tripId,
        stopId,
        activity
      ) => {

        await apiAddActivity(
          stopId,
          {
            activity_id:
              activity.activityId,

            activity_date:
              activity.date,

            start_time:
              activity.time || null
          }
        );


        const updatedTrip =
          await loadTrip(
            tripId
          );


        setTrips(
          (prev) =>
            prev.map(
              (trip) =>
                trip.id ===
                String(tripId)
                  ? updatedTrip
                  : trip
            )
        );


        return updatedTrip;

      },
      [loadTrip]
    );


  // ==================================================
  // ADD EXPENSE
  // ==================================================

  const addExpenseToTrip =
    useCallback(
      async (
        tripId,
        expense
      ) => {

        await apiAddExpense(
          tripId,
          {
            category:
              expense.category,

            description:
              expense.title ||
              expense.description ||
              "",

            amount:
              Number(
                expense.amount
              )
          }
        );


        const updatedTrip =
          await loadTrip(
            tripId
          );


        setTrips(
          (prev) =>
            prev.map(
              (trip) =>
                trip.id ===
                String(tripId)
                  ? updatedTrip
                  : trip
            )
        );


        return updatedTrip;

      },
      [loadTrip]
    );


  // ==================================================
  // DELETE EXPENSE
  // ==================================================

  const deleteExpenseFromTrip =
    useCallback(
      async (
        tripId,
        expenseId
      ) => {

        await apiDeleteExpense(
          tripId,
          expenseId
        );


        const updatedTrip =
          await loadTrip(
            tripId
          );


        setTrips(
          (prev) =>
            prev.map(
              (trip) =>
                trip.id ===
                String(tripId)
                  ? updatedTrip
                  : trip
            )
        );

      },
      [loadTrip]
    );


  // ==================================================
  // REFRESH TRIP
  // ==================================================

  const refreshTrip =
    useCallback(
      async (
        tripId
      ) => {

        const updatedTrip =
          await loadTrip(
            tripId
          );


        setTrips(
          (prev) =>
            prev.map(
              (trip) =>
                trip.id ===
                String(tripId)
                  ? updatedTrip
                  : trip
            )
        );


        return updatedTrip;

      },
      [loadTrip]
    );


  // ==================================================
  // CONTEXT VALUE
  // ==================================================

  const value =
    useMemo(
      () => ({
        trips,

        cities,

        activeTrip,

        loading,

        error,

        addTrip,

        addStopToTrip,

        addActivityToStop,

        addExpenseToTrip,

        deleteExpenseFromTrip,

        refreshTrip,

        setActiveTrip
      }),
      [
        trips,

        cities,

        activeTrip,

        loading,

        error,

        addTrip,

        addStopToTrip,

        addActivityToStop,

        addExpenseToTrip,

        deleteExpenseFromTrip,

        refreshTrip,

        setActiveTrip
      ]
    );


  return (
    <TripContext.Provider
      value={value}
    >
      {children}
    </TripContext.Provider>
  );
}


// ==================================================
// HOOK
// ==================================================

export function useTrip() {

  const context =
    useContext(TripContext);

  if (!context) {

    throw new Error(
      "useTrip must be used inside TripProvider"
    );

  }

  return context;
}