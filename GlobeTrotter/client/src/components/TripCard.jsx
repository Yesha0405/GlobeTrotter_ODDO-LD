import { Link } from 'react-router-dom';
import { formatDate, getTripDuration } from '../utils/date';
import { getBudgetSummary } from '../utils/budget';
import { MapPin, CalendarDays, Users, Wallet, ArrowRight, Compass } from 'lucide-react';

export default function TripCard({ trip, onViewClick }) {
  if (!trip) return null;

  const duration = getTripDuration(trip.startDate, trip.endDate);
  const durationText = duration > 0 ? `${duration} ${duration === 1 ? 'day' : 'days'}` : '';
  const budgetSum = trip.budget ? getBudgetSummary(trip.budget, trip.expenses) : null;

  // Status Badge color classes
  const statusBadges = {
    ongoing: 'text-[#0d9488] bg-[#f0fdfa] border-teal-100',
    upcoming: 'text-[#d97706] bg-amber-50 border-amber-100',
    completed: 'text-slate-600 bg-slate-100 border-slate-200'
  };

  // Budget progress bar colors
  const getProgressBarColor = (percentage) => {
    if (percentage >= 100) return 'bg-[#dc2626]'; // over budget
    if (percentage >= 75) return 'bg-[#d97706]';  // warning budget
    return 'bg-[#0d9488]';                        // safe budget
  };

  const countActivities = (t) => {
    if (!t.stops) return 0;
    return t.stops.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0);
  };

  return (
    <article className="group bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-150 flex flex-col h-full font-body">
      {/* Header Visual Image/Gradient */}
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
        
        {/* Status Badge overlay */}
        <span className={`absolute top-4 right-4 px-2.5 py-1 text-xs font-semibold rounded-[10px] border shadow-sm capitalize ${
          statusBadges[trip.status] || statusBadges.upcoming
        }`}>
          {trip.status}
        </span>
      </div>

      {/* Main Card Body */}
      <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
        <div className="space-y-4">
          {/* Destination and Title */}
          <div>
            <h2 className="text-xl font-bold font-heading text-[#0f172a] group-hover:text-[#0d9488] transition-colors leading-tight">
              {trip.title}
            </h2>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{trip.destination}</span>
            </div>
          </div>

          {/* Dates & Travelers Row */}
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

          {/* Stops and Activities counts */}
          <div className="flex justify-between items-center text-xs text-slate-600">
            <span className="font-medium">
              {trip.stops?.length || 0} {trip.stops?.length === 1 ? 'stop' : 'stops'} planned
            </span>
            <span className="font-medium">
              {countActivities(trip)} {countActivities(trip) === 1 ? 'activity' : 'activities'}
            </span>
          </div>

          {/* Budget Progress Bar */}
          {budgetSum ? (
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
              
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor(budgetSum.percentage)}`}
                  style={{ width: `${budgetSum.percentage}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic pt-2">No budget allocated</p>
          )}
        </div>

        {/* CTA Button Actions */}
        <div className="pt-2">
          {onViewClick ? (
            <button
              onClick={onViewClick}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#e2e8f0] hover:border-[#0d9488] hover:bg-[#f0fdfa] text-slate-700 hover:text-[#0d9488] text-sm font-semibold rounded-[10px] transition-all group/btn"
            >
              <span>View Itinerary</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          ) : (
            <Link
              to={`/itinerary/${trip.id}`}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#e2e8f0] hover:border-[#0d9488] hover:bg-[#f0fdfa] text-slate-700 hover:text-[#0d9488] text-sm font-semibold rounded-[10px] transition-all group/btn"
            >
              <span>View Itinerary</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
