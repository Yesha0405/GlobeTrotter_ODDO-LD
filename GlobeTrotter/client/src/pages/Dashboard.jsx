import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { formatDate, getTripDuration } from '../utils/date';
import { getBudgetSummary } from '../utils/budget';
import { 
  Map, 
  CalendarDays, 
  Compass, 
  CheckCircle2, 
  Plus, 
  Users, 
  ArrowRight, 
  AlertCircle, 
  MapPin,
  Wallet
} from 'lucide-react';

export default function Dashboard() {
  const { trips, loading, error } = useTrip();
  const [activeFilter, setActiveFilter] = useState('all');

  // ==================================================
  // 1. CALCULATE SUMMARY STATS
  // ==================================================
  const stats = useMemo(() => {
    const total = trips.length;
    const ongoing = trips.filter(t => t.status === 'ongoing').length;
    const upcoming = trips.filter(t => t.status === 'upcoming').length;
    const completed = trips.filter(t => t.status === 'completed').length;
    return { total, ongoing, upcoming, completed };
  }, [trips]);

  // ==================================================
  // 2. FILTER TRIPS
  // ==================================================
  const filteredTrips = useMemo(() => {
    if (activeFilter === 'all') return trips;
    return trips.filter(t => t.status === activeFilter);
  }, [trips, activeFilter]);

  // ==================================================
  // 3. RENDER LOADING STATE (SKELETONS)
  // ==================================================
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse font-body">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-[10px]"></div>
            <div className="h-4 w-96 bg-slate-200 rounded-[10px]"></div>
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded-[10px]"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl border border-slate-100"></div>
          ))}
        </div>

        {/* Filter Skeletons */}
        <div className="h-10 w-80 bg-slate-200 rounded-[10px]"></div>

        {/* Card Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-200 rounded-2xl border border-slate-100"></div>
          ))}
        </div>
      </main>
    );
  }

  // ==================================================
  // 4. RENDER ERROR STATE
  // ==================================================
  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-body">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-3 items-start">
          <AlertCircle className="w-6 h-6 text-[#dc2626] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold font-heading text-[#0f172a]">Configuration Error</h3>
            <p className="text-sm text-slate-600 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#dc2626] hover:bg-red-700 text-white text-sm font-medium rounded-[10px] transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Helper to count activities in a trip object
  const countActivities = (trip) => {
    if (!trip.stops) return 0;
    return trip.stops.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-body">
      
      {/* ==================================================
          PAGE HEADER
          ================================================== */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-heading text-[#0f172a]">
            Welcome back, Alex
          </h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Plan your next adventure, manage your schedules, and track travel budgets seamlessly.
          </p>
        </div>
        <Link
          to="/create-trip"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-[10px] shadow-sm transition-all duration-150 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Plan a Trip</span>
        </Link>
      </header>

      {/* ==================================================
          SUMMARY METRICS GRID
          ================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Trips */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-[10px] text-[#0f172a]">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Trips</span>
            <span className="text-2xl font-bold font-heading text-[#0f172a]">{stats.total}</span>
          </div>
        </div>

        {/* Ongoing */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 rounded-[10px] text-[#0d9488]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Ongoing</span>
            <span className="text-2xl font-bold font-heading text-[#0f172a]">{stats.ongoing}</span>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-[10px] text-[#d97706]">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming</span>
            <span className="text-2xl font-bold font-heading text-[#0f172a]">{stats.upcoming}</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-[10px] text-[#059669]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
            <span className="text-2xl font-bold font-heading text-[#0f172a]">{stats.completed}</span>
          </div>
        </div>
      </section>

      {/* ==================================================
          FILTER NAVIGATION TABS
          ================================================== */}
      <section className="border-b border-[#e2e8f0] pb-2 flex gap-1 overflow-x-auto">
        {['all', 'ongoing', 'upcoming', 'completed'].map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-[10px] capitalize transition-all duration-150 shrink-0 ${
                isActive 
                  ? 'text-[#0d9488] bg-[#f0fdfa]' 
                  : 'text-[#475569] hover:bg-slate-50 hover:text-[#0f172a]'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </section>

      {/* ==================================================
          TRIP CARDS LISTING GRID
          ================================================== */}
      <section>
        {filteredTrips.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center max-w-xl mx-auto shadow-sm">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold font-heading text-[#0f172a]">
              {activeFilter === 'all' ? 'No trips planned yet' : `No ${activeFilter} trips`}
            </h3>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              {activeFilter === 'all' 
                ? 'Create a new trip to build day-by-day schedules, customize activities, and manage your budget.'
                : `You currently do not have any trips marked as ${activeFilter}.`}
            </p>
            {activeFilter === 'all' && (
              <Link
                to="/create-trip"
                className="inline-flex items-center gap-1.5 mt-6 px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-[10px] shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create a Trip</span>
              </Link>
            )}
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => {
              const duration = getTripDuration(trip.startDate, trip.endDate);
              const budgetSum = trip.budget ? getBudgetSummary(trip.budget, trip.expenses) : null;
              
              // Status Badge color mapping
              const statusBadges = {
                ongoing: 'text-[#0d9488] bg-[#f0fdfa] border-teal-100',
                upcoming: 'text-[#d97706] bg-amber-50 border-amber-100',
                completed: 'text-slate-600 bg-slate-100 border-slate-200'
              };

              // Progress bar color mapping
              const getProgressBarColor = (percentage) => {
                if (percentage >= 100) return 'bg-[#dc2626]'; // over budget
                if (percentage >= 75) return 'bg-[#d97706]';  // warning budget
                return 'bg-[#0d9488]';                        // safe budget
              };

              return (
                <article 
                  key={trip.id} 
                  className="group bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-150 flex flex-col h-full"
                >
                  {/* Card Visual Header */}
                  <div className="relative h-44 w-full bg-slate-100 shrink-0">
                    {trip.coverImage ? (
                      <img 
                        src={trip.coverImage} 
                        alt={trip.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-teal-500 to-slate-800 flex items-center justify-center p-6 text-white text-center">
                        <Compass className="w-12 h-12 opacity-30" />
                      </div>
                    )}
                    
                    {/* Status Badge overlays the image */}
                    <span className={`absolute top-4 right-4 px-2.5 py-1 text-xs font-semibold rounded-[10px] border shadow-sm capitalize ${
                      statusBadges[trip.status] || statusBadges.upcoming
                    }`}>
                      {trip.status}
                    </span>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Name & Destination */}
                      <div>
                        <h2 className="text-xl font-bold font-heading text-[#0f172a] group-hover:text-[#0d9488] transition-colors leading-tight">
                          {trip.title}
                        </h2>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{trip.destination}</span>
                        </div>
                      </div>

                      {/* Date details and Travelers */}
                      <div className="flex justify-between items-center text-xs text-slate-600 border-y border-[#e2e8f0] py-3">
                        <div>
                          <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Dates</span>
                          <span className="font-semibold mt-0.5 block">
                            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Travelers</span>
                          <span className="font-semibold mt-0.5 block flex items-center justify-end gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {trip.travelers} {trip.travelers === 1 ? 'Guest' : 'Guests'}
                          </span>
                        </div>
                      </div>

                      {/* Itinerary stops summary */}
                      <div className="flex justify-between items-center text-xs text-slate-600">
                        <span className="font-medium">
                          {trip.stops?.length || 0} {trip.stops?.length === 1 ? 'stop' : 'stops'} planned
                        </span>
                        <span className="font-medium">
                          {countActivities(trip)} {countActivities(trip) === 1 ? 'activity' : 'activities'}
                        </span>
                      </div>

                      {/* Budget Tracker Progress */}
                      {budgetSum && (
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between text-xs text-slate-600">
                            <span className="flex items-center gap-1 font-medium">
                              <Wallet className="w-3.5 h-3.5 text-slate-400" />
                              Budget Spent
                            </span>
                            <span className="font-semibold text-[#0f172a]">
                              {trip.currency || 'USD'} {budgetSum.spent} / {budgetSum.budget}
                            </span>
                          </div>
                          
                          {/* Progress line */}
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor(budgetSum.percentage)}`}
                              style={{ width: `${budgetSum.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* View Button */}
                    <div className="pt-2">
                      <Link
                        to={`/itinerary/${trip.id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#e2e8f0] hover:border-[#0d9488] hover:bg-[#f0fdfa] text-slate-700 hover:text-[#0d9488] text-sm font-semibold rounded-[10px] transition-all font-body group/btn"
                      >
                        <span>View Itinerary</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}
