import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { formatDate, formatDayName, getDayNumber, getDateRange } from '../utils/date';
import { getBudgetSummary } from '../utils/budget';
import StopCard from '../components/StopCard';
import ActivityCard from '../components/ActivityCard';
import ActivityModal from '../components/ActivityModal';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  AlertCircle, 
  Compass, 
  Plus, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function Timeline() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, deleteStopFromTrip, addActivityToStop, updateActivityInStop, removeActivityFromStop } = useTrip();

  // Find the trip
  const trip = useMemo(() => {
    return trips.find(t => t.id === tripId) || null;
  }, [trips, tripId]);

  // Calendar dates range
  const dates = useMemo(() => {
    if (!trip) return [];
    return getDateRange(trip.startDate, trip.endDate);
  }, [trip]);

  const [selectedDate, setSelectedDate] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStopId, setModalStopId] = useState(null);
  const [modalActivityData, setModalActivityData] = useState(null);

  // Initialize selected date to first day
  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  // Stops filtered for selected day
  const dayStops = useMemo(() => {
    if (!trip || !trip.stops || !selectedDate) return [];
    return trip.stops.filter(s => s.date === selectedDate);
  }, [trip, selectedDate]);

  // Budget summary calculations
  const budgetSum = useMemo(() => {
    if (!trip) return null;
    return getBudgetSummary(trip.budget || 0, trip.expenses || []);
  }, [trip]);

  if (!trip) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center font-body space-y-4">
        <AlertCircle className="w-12 h-12 text-[#dc2626] mx-auto" />
        <h2 className="text-2xl font-bold font-heading text-[#0f172a]">Trip Not Found</h2>
        <p className="text-slate-500">We couldn't locate the travel timeline you requested.</p>
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-[10px] shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </main>
    );
  }

  // Activity Modal Triggers
  const handleOpenAddModal = (stopId) => {
    setModalStopId(stopId);
    setModalActivityData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (stopId, activity) => {
    setModalStopId(stopId);
    setModalActivityData(activity);
    setIsModalOpen(true);
  };

  const handleSaveActivity = (activityForm) => {
    if (modalActivityData) {
      // Edit mode
      updateActivityInStop(trip.id, modalStopId, modalActivityData.id, activityForm);
    } else {
      // Create mode
      addActivityToStop(trip.id, modalStopId, activityForm);
    }
    setIsModalOpen(false);
  };

  // Delete Stop confirmation
  const handleDeleteStop = (stopId) => {
    if (window.confirm('Are you sure you want to delete this stop and all its activities?')) {
      deleteStopFromTrip(trip.id, stopId);
    }
  };

  // Delete Activity confirmation
  const handleDeleteActivity = (stopId, activityId) => {
    if (window.confirm('Are you sure you want to remove this activity from your stop?')) {
      removeActivityFromStop(trip.id, stopId, activityId);
    }
  };

  // Budget warning classes mapping
  const budgetColors = {
    safe: { text: 'text-[#059669]', bg: 'bg-emerald-50 border-emerald-100', progress: 'bg-[#059669]' },
    warning: { text: 'text-[#d97706]', bg: 'bg-amber-50 border-amber-100', progress: 'bg-[#d97706]' },
    over: { text: 'text-[#dc2626]', bg: 'bg-red-50 border-red-200', progress: 'bg-[#dc2626]' }
  };
  const activeColor = budgetColors[budgetSum?.status] || budgetColors.safe;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-body">
      
      {/* ==================================================
          PAGE HEADER
          ================================================== */}
      <header className="space-y-4">
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0d9488] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trips</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold font-heading text-[#0f172a]">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#0d9488]" />
                {trip.destination}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {trip.travelers} Guests
              </span>
            </div>
          </div>

          <Link
            to={`/build-itinerary/${trip.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#e2e8f0] hover:border-[#0d9488] hover:bg-[#f0fdfa] text-slate-700 hover:text-[#0d9488] text-sm font-semibold rounded-[10px] transition-all"
          >
            <span>Edit Route / Stops</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ==================================================
          3-COLUMN DETAILED LAYOUT
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-8 items-start">
        
        {/* LEFT COLUMN: DAY NAVIGATION LIST */}
        <nav className="space-y-2 lg:sticky lg:top-24">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">
            Trip Days
          </h3>
          <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 shrink-0">
            {dates.map((dateStr) => {
              const isActive = selectedDate === dateStr;
              const dayNum = getDayNumber(trip.startDate, dateStr);
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex lg:flex-row flex-col lg:items-center justify-between text-left px-4 py-3 rounded-[10px] transition-all duration-150 shrink-0 min-w-[100px] lg:min-w-0 ${
                    isActive 
                      ? 'text-[#0d9488] bg-[#f0fdfa] border border-teal-100 font-semibold' 
                      : 'text-[#475569] bg-white border border-[#e2e8f0] hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-bold font-heading">Day {dayNum}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 lg:mt-0 font-medium">
                    {formatDate(dateStr, { month: 'short', day: 'numeric' })}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* CENTER COLUMN: DETAILED ITINERARY TIMELINE */}
        <section className="space-y-6">
          {/* Day Heading Header */}
          {selectedDate && (
            <div className="border-b border-[#e2e8f0] pb-4">
              <h2 className="text-2xl font-bold font-heading text-[#0f172a]">
                Day {getDayNumber(trip.startDate, selectedDate)}
              </h2>
              <p className="text-sm text-[#0d9488] font-semibold mt-0.5">
                {formatDayName(selectedDate)}, {formatDate(selectedDate)}
              </p>
            </div>
          )}

          {/* Stops Timeline */}
          {dayStops.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center shadow-sm">
              <Compass className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold font-heading text-[#0f172a]">No stops planned</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                Build this day's itinerary by adding stops and scheduling sightseeing activities.
              </p>
              <Link
                to={`/build-itinerary/${trip.id}`}
                className="inline-flex items-center gap-1.5 mt-6 px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-[10px] shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stop</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6 relative pl-4 border-l-2 border-slate-100">
              {dayStops.map((stop) => (
                <div key={stop.id} className="relative">
                  {/* Timeline Dot Connector */}
                  <div className="absolute left-[-23px] top-5 w-4.5 h-4.5 rounded-full bg-white border-2 border-[#0d9488] z-20"></div>
                  
                  <StopCard
                    stop={stop}
                    onEdit={() => navigate(`/build-itinerary/${trip.id}`)}
                    onDelete={() => handleDeleteStop(stop.id)}
                    onAddActivity={() => handleOpenAddModal(stop.id)}
                  >
                    {stop.activities && stop.activities.length > 0 ? (
                      <div className="space-y-3">
                        {stop.activities.map(activity => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onEdit={() => handleOpenEditModal(stop.id, activity)}
                            onDelete={() => handleDeleteActivity(stop.id, activity.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">
                        No activities planned at this stop yet. Click Add Activity above to begin scheduling.
                      </p>
                    )}
                  </StopCard>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: BUDGET SUMMARY PANEL */}
        <aside className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2e8f0] pb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0d9488]" />
              Budget Summary
            </h3>

            {budgetSum && trip.budget > 0 ? (
              <div className="space-y-4">
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Budget</span>
                    <span className="text-sm text-[#0f172a] font-bold">
                      {trip.currency || 'USD'} ${budgetSum.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Spent</span>
                    <span className="text-sm text-[#0f172a] font-bold">
                      {trip.currency || 'USD'} ${budgetSum.spent.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status Box */}
                <div className={`p-4 border rounded-2xl text-xs flex gap-2 items-start ${activeColor.bg}`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block capitalize">Budget Status: {budgetSum.status}</span>
                    <span className="text-slate-500 block mt-0.5">
                      {budgetSum.status === 'over' 
                        ? 'Your expenses have exceeded your allocated budget ceiling.'
                        : budgetSum.status === 'warning'
                          ? 'Warning: You have used over 75% of your trip budget.'
                          : 'Your budget is currently in the safe zone.'
                      }
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Used Percentage</span>
                    <span className={activeColor.text}>{budgetSum.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${activeColor.progress}`}
                      style={{ width: `${budgetSum.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Remaining Amount */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-500">Remaining</span>
                  <span className="text-[#0f172a] font-bold">
                    {trip.currency || 'USD'} ${budgetSum.remaining.toLocaleString()}
                  </span>
                </div>

              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs italic space-y-2">
                <Wallet className="w-8 h-8 text-slate-200 mx-auto" />
                <p>No budget limits configured for this trip.</p>
              </div>
            )}
          </div>
        </aside>

      </div>

      {/* ==================================================
          ACTIVITY EDIT/ADD MODAL WINDOW
          ================================================== */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveActivity}
        activityData={modalActivityData}
      />

    </main>
  );
}
