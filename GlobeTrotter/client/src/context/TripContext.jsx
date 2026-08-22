import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// ==================================================
// 1. CONSTANTS / STORAGE KEYS
// ==================================================
const LOCAL_STORAGE_TRIPS_KEY = 'globetrotter_trips';
const LOCAL_STORAGE_ACTIVE_TRIP_KEY = 'globetrotter_active_trip';

// ==================================================
// 2. SEED DATA
// ==================================================
const SEED_TRIPS = [
  {
    id: 'trip-1',
    title: 'Paris Escape',
    destination: 'Paris, France',
    startDate: '2026-06-01',
    endDate: '2026-06-07',
    status: 'completed',
    budget: 2500,
    currency: 'EUR',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    travelers: 2,
    stops: [
      {
        id: 'stop-1-1',
        date: '2026-06-01',
        location: 'Charles de Gaulle Airport',
        title: 'Arrival in Paris',
        description: 'Land at CDG airport, pick up luggage and transit to Hotel Lutetia.',
        transport: 'Taxi',
        activities: [
          {
            id: 'act-1-1-1',
            name: 'Hotel Check-in',
            type: 'Lodging',
            time: '14:00',
            duration: 45,
            price: 0,
            description: 'Check-in at Hotel Lutetia, settle into rooms and unpack.'
          },
          {
            id: 'act-1-1-2',
            name: 'Seine River Cruise',
            type: 'Sightseeing',
            time: '19:00',
            duration: 120,
            price: 30,
            description: 'Evening cruise along the Seine to view landmark monuments lit up.'
          }
        ]
      },
      {
        id: 'stop-1-2',
        date: '2026-06-02',
        location: 'Louvre Museum',
        title: 'Cultural Highlights',
        description: 'Spend the day browsing Louvre collections and stroll through the Tuileries Garden.',
        transport: 'Metro',
        activities: [
          {
            id: 'act-1-2-1',
            name: 'Louvre Guided Tour',
            type: 'Museum',
            time: '09:30',
            duration: 180,
            price: 65,
            description: 'Guided tour of historical art pieces including Mona Lisa and Venus de Milo.'
          }
        ]
      }
    ],
    expenses: [
      {
        id: 'exp-1-1',
        title: 'Hotel Lutetia Stay',
        category: 'Lodging',
        amount: 1200,
        date: '2026-06-01'
      },
      {
        id: 'exp-1-2',
        title: 'Seine Cruise Tickets',
        category: 'Activities',
        amount: 60,
        date: '2026-06-01'
      },
      {
        id: 'exp-1-3',
        title: 'Louvre Tour Tickets',
        category: 'Activities',
        amount: 130,
        date: '2026-06-02'
      },
      {
        id: 'exp-1-4',
        title: 'Dinner at Le Comptoir',
        category: 'Food',
        amount: 95,
        date: '2026-06-02'
      }
    ]
  },
  {
    id: 'trip-2',
    title: 'Tokyo Sakura Adventure',
    destination: 'Tokyo, Japan',
    startDate: '2027-03-25',
    endDate: '2027-04-02',
    status: 'upcoming',
    budget: 4000,
    currency: 'USD',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    travelers: 1,
    stops: [
      {
        id: 'stop-2-1',
        date: '2027-03-25',
        location: 'Shinjuku Gyoen National Garden',
        title: 'Sakura View Walk',
        description: 'Stroll around Shinjuku Gyoen to see early cherry blossoms.',
        transport: 'Train',
        activities: [
          {
            id: 'act-2-1-1',
            name: 'Cherry Blossom Picnic',
            type: 'Sightseeing',
            time: '13:00',
            duration: 120,
            price: 15,
            description: 'Savor seasonal bento boxes under blooming sakura trees.'
          }
        ]
      }
    ],
    expenses: [
      {
        id: 'exp-2-1',
        title: 'Bento Picnic Lunch',
        category: 'Food',
        amount: 15,
        date: '2027-03-25'
      },
      {
        id: 'exp-2-2',
        title: '7-Day JR Rail Pass',
        category: 'Transport',
        amount: 350,
        date: '2027-03-24'
      }
    ]
  },
  {
    id: 'trip-3',
    title: 'Alps Ski Trip',
    destination: 'Zermatt, Switzerland',
    startDate: '2027-01-15',
    endDate: '2027-01-22',
    status: 'ongoing',
    budget: 3500,
    currency: 'CHF',
    coverImage: 'https://images.unsplash.com/photo-1482867996988-2faec3cbb4f9?auto=format&fit=crop&w=800&q=80',
    travelers: 3,
    stops: [
      {
        id: 'stop-3-1',
        date: '2027-01-15',
        location: 'Matterhorn Glacier Paradise',
        title: 'Rental Pickup & Check-in',
        description: 'Transit to chalet, pick up rental skis, and purchase ski passes.',
        transport: 'Cable Car',
        activities: [
          {
            id: 'act-3-1-1',
            name: 'Ski Gear Fitting',
            type: 'Rental',
            time: '10:00',
            duration: 90,
            price: 85,
            description: 'Pick up fitted snow skis, boots, poles, and safety helmets.'
          }
        ]
      }
    ],
    expenses: [
      {
        id: 'exp-3-1',
        title: 'Alpine Ski Chalet (1 Week)',
        category: 'Lodging',
        amount: 1800,
        date: '2027-01-15'
      },
      {
        id: 'exp-3-2',
        title: '6-Day Zermatt Ski Pass',
        category: 'Activities',
        amount: 450,
        date: '2027-01-15'
      },
      {
        id: 'exp-3-3',
        title: 'Rental Skis Fitting',
        category: 'Activities',
        amount: 85,
        date: '2027-01-15'
      }
    ]
  }
];

// ==================================================
// 3. CONTEXT CREATION
// ==================================================
const TripContext = createContext(null);

// ==================================================
// 4. PROVIDER IMPLEMENTATION
// ==================================================
export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==================================================
  // 5. INITIALIZATION
  // ==================================================
  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const storedTrips = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
      let parsedTrips = [];
      if (storedTrips) {
        try {
          parsedTrips = JSON.parse(storedTrips);
        } catch (e) {
          console.error('Failed to parse stored trips JSON, seeding default data.', e);
          parsedTrips = SEED_TRIPS;
          localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(SEED_TRIPS));
        }
      } else {
        parsedTrips = SEED_TRIPS;
        localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(SEED_TRIPS));
      }

      if (!Array.isArray(parsedTrips) || parsedTrips.length === 0) {
        parsedTrips = SEED_TRIPS;
        localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(SEED_TRIPS));
      }

      setTrips(parsedTrips);

      const storedActiveId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_TRIP_KEY);
      if (storedActiveId && parsedTrips.some(t => t.id === storedActiveId)) {
        setActiveTripId(storedActiveId);
      } else {
        setActiveTripId(null);
      }
    } catch (err) {
      setError('Failed to initialize local data store.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================================================
  // 6. PERSISTENCE
  // ==================================================
  useEffect(() => {
    // Only persist if trips state has been populated (i.e. loading is done)
    if (!loading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(trips));
      } catch (err) {
        console.error('Failed to save trips state to localStorage', err);
        setError('Failed to write changes to local storage.');
      }
    }
  }, [trips, loading]);

  useEffect(() => {
    if (!loading) {
      try {
        if (activeTripId) {
          localStorage.setItem(LOCAL_STORAGE_ACTIVE_TRIP_KEY, activeTripId);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_ACTIVE_TRIP_KEY);
        }
      } catch (err) {
        console.error('Failed to save active trip key to localStorage', err);
      }
    }
  }, [activeTripId, loading]);

  // Synchronize the full activeTrip object when trips update
  const activeTrip = useMemo(() => {
    if (!activeTripId) return null;
    return trips.find(t => t.id === activeTripId) || null;
  }, [trips, activeTripId]);

  // ==================================================
  // 7. TRIP OPERATIONS
  // ==================================================
  const addTrip = useCallback((newTrip) => {
    setTrips(prev => {
      const formattedTrip = {
        ...newTrip,
        id: newTrip.id || `trip-${Date.now()}`,
        stops: newTrip.stops || [],
        expenses: newTrip.expenses || []
      };
      return [...prev, formattedTrip];
    });
  }, []);

  const updateTrip = useCallback((tripId, updates) => {
    setTrips(prev => prev.map(t => (t.id === tripId ? { ...t, ...updates } : t)));
  }, []);

  const deleteTrip = useCallback((tripId) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    setActiveTripId(prev => (prev === tripId ? null : prev));
  }, []);

  const setActiveTrip = useCallback((tripId) => {
    setActiveTripId(prev => {
      const exists = trips.some(t => t.id === tripId);
      return exists ? tripId : null;
    });
  }, [trips]);

  // ==================================================
  // 8. STOP OPERATIONS
  // ==================================================
  const addStopToTrip = useCallback((tripId, stop) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const formattedStop = {
        ...stop,
        id: stop.id || `stop-${Date.now()}`,
        activities: stop.activities || []
      };
      return {
        ...t,
        stops: [...t.stops, formattedStop]
      };
    }));
  }, []);

  const updateStopInTrip = useCallback((tripId, stopId, updates) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        stops: t.stops.map(s => (s.id === stopId ? { ...s, ...updates } : s))
      };
    }));
  }, []);

  const deleteStopFromTrip = useCallback((tripId, stopId) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        stops: t.stops.filter(s => s.id !== stopId)
      };
    }));
  }, []);

  // ==================================================
  // 9. ACTIVITY OPERATIONS
  // ==================================================
  const addActivityToStop = useCallback((tripId, stopId, activity) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        stops: t.stops.map(s => {
          if (s.id !== stopId) return s;
          const formattedActivity = {
            ...activity,
            id: activity.id || `act-${Date.now()}`
          };
          return {
            ...s,
            activities: [...s.activities, formattedActivity]
          };
        })
      };
    }));
  }, []);

  const updateActivityInStop = useCallback((tripId, stopId, activityId, updates) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        stops: t.stops.map(s => {
          if (s.id !== stopId) return s;
          return {
            ...s,
            activities: s.activities.map(a => (a.id === activityId ? { ...a, ...updates } : a))
          };
        })
      };
    }));
  }, []);

  const removeActivityFromStop = useCallback((tripId, stopId, activityId) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        stops: t.stops.map(s => {
          if (s.id !== stopId) return s;
          return {
            ...s,
            activities: s.activities.filter(a => a.id !== activityId)
          };
        })
      };
    }));
  }, []);

  // ==================================================
  // 10. EXPENSE OPERATIONS
  // ==================================================
  const addExpenseToTrip = useCallback((tripId, expense) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const formattedExpense = {
        ...expense,
        id: expense.id || `exp-${Date.now()}`
      };
      return {
        ...t,
        expenses: [...t.expenses, formattedExpense]
      };
    }));
  }, []);

  const deleteExpenseFromTrip = useCallback((tripId, expenseId) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        expenses: t.expenses.filter(e => e.id !== expenseId)
      };
    }));
  }, []);

  // ==================================================
  // 11. CONTEXT VALUE
  // ==================================================
  const value = useMemo(() => ({
    trips,
    activeTrip,
    loading,
    error,
    addTrip,
    updateTrip,
    deleteTrip,
    setActiveTrip,
    addStopToTrip,
    updateStopInTrip,
    deleteStopFromTrip,
    addActivityToStop,
    updateActivityInStop,
    removeActivityFromStop,
    addExpenseToTrip,
    deleteExpenseFromTrip
  }), [
    trips,
    activeTrip,
    loading,
    error,
    addTrip,
    updateTrip,
    deleteTrip,
    setActiveTrip,
    addStopToTrip,
    updateStopInTrip,
    deleteStopFromTrip,
    addActivityToStop,
    updateActivityInStop,
    removeActivityFromStop,
    addExpenseToTrip,
    deleteExpenseFromTrip
  ]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

// ==================================================
// 12. useTrip CUSTOM HOOK
// ==================================================
export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
