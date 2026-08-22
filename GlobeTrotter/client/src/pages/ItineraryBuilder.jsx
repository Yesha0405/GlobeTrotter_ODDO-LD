import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { formatDate, getTripDuration } from '../utils/date';
import { 
  ArrowLeft, 
  MapPin, 
  CalendarDays, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Plane, 
  Train, 
  Car, 
  Bus, 
  AlertCircle, 
  Map, 
  Compass, 
  Wallet,
  StickyNote
} from 'lucide-react';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const { trips, addStopToTrip, updateStopInTrip, deleteStopFromTrip } = useTrip();

  // Find the trip
  const trip = useMemo(() => {
    return trips.find(t => t.id === tripId) || null;
  }, [trips, tripId]);

  // Form State for Stop Creation/Edit
  const [stopForm, setStopForm] = useState({
    location: '',
    date: '',
    transport: 'Flight',
    notes: ''
  });
  const [editingStopId, setEditingStopId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  // Chronologically sorted stops
  const sortedStops = useMemo(() => {
    if (!trip || !trip.stops) return [];
    return [...trip.stops].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [trip]);

  // If trip is loading or not found
  if (!trip) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center font-body space-y-4">
        <AlertCircle className="w-12 h-12 text-[#dc2626] mx-auto" />
        <h2 className="text-2xl font-bold font-heading text-[#0f172a]">Trip Not Found</h2>
        <p className="text-slate-500">We couldn't locate the travel itinerary you requested.</p>
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

  const duration = getTripDuration(trip.startDate, trip.endDate);
  const durationText = duration > 0 ? `${duration} ${duration === 1 ? 'day' : 'days'}` : '';

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStopForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectTransport = (mode) => {
    setStopForm(prev => ({ ...prev, transport: mode }));
  };

  // Form Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!stopForm.location.trim()) {
      tempErrors.location = 'Stop location or title is required.';
    }
    if (!stopForm.date) {
      tempErrors.date = 'Date is required.';
    } else {
      if (stopForm.date < trip.startDate || stopForm.date > trip.endDate) {
        tempErrors.date = `Date must fall within the trip range (${formatDate(trip.startDate)} to ${formatDate(trip.endDate)}).`;
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit Add or Edit Stop
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingStopId) {
      updateStopInTrip(trip.id, editingStopId, {
        location: stopForm.location.trim(),
        date: stopForm.date,
        transport: stopForm.transport,
        notes: stopForm.notes.trim()
      });
      setEditingStopId(null);
    } else {
      addStopToTrip(trip.id, {
        location: stopForm.location.trim(),
        date: stopForm.date,
        transport: stopForm.transport,
        notes: stopForm.notes.trim(),
        activities: []
      });
    }

    // Reset Form
    setStopForm({
      location: '',
      date: '',
      transport: 'Flight',
      notes: ''
    });
    setShowForm(false);
  };

  // Trigger Edit Stop
  const handleEditClick = (stop) => {
    setStopForm({
      location: stop.location,
      date: stop.date,
      transport: stop.transport || 'Flight',
      notes: stop.notes || ''
    });
    setEditingStopId(stop.id);
    setShowForm(true);
    // Scroll to form smoothly
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Delete Stop Trigger
  const handleDeleteClick = (stopId) => {
    if (window.confirm('Are you sure you want to remove this stop from your itinerary?')) {
      deleteStopFromTrip(trip.id, stopId);
      if (editingStopId === stopId) {
        setEditingStopId(null);
        setStopForm({ location: '', date: '', transport: 'Flight', notes: '' });
      }
    }
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case 'Flight': return Plane;
      case 'Train': return Train;
      case 'Car': return Car;
      default: return Bus;
    }
  };

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
            <h1 className="text-3xl font-extrabold font-heading text-[#0f172a]">
              Build your itinerary
            </h1>
            <p className="text-slate-500 text-sm">
              Configure the stops and travel transport legs connecting your route.
            </p>
          </div>
          <Link
            to={`/itinerary/${trip.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-semibold rounded-[10px] shadow-sm transition-all"
          >
            <span>View Timeline</span>
            <Compass className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ==================================================
          TRIP OVERVIEW SUMMARY CARD
          ================================================== */}
      <section className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-wrap gap-y-4 gap-x-8 items-center text-sm text-[#0f172a]">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#0d9488]" />
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destination</span>
            <span className="font-semibold">{trip.destination}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dates</span>
            <span className="font-semibold">{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-slate-400" />
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duration</span>
            <span className="font-semibold">{durationText}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Travelers</span>
            <span className="font-semibold">{trip.travelers} Guests</span>
          </div>
        </div>

        {trip.budget > 0 && (
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-slate-400" />
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Budget</span>
              <span className="font-semibold">{trip.currency || 'USD'} ${trip.budget.toLocaleString()}</span>
            </div>
          </div>
        )}
      </section>

      {/* ==================================================
          SPLIT LAYOUT: MAIN BUILDER & SIDE PREVIEW
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* BUILDER TIMELINE & STOPS FORM (LEFT) */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* Add/Edit Stop Button */}
          {!showForm && (
            <button
              onClick={() => {
                setEditingStopId(null);
                setStopForm({ location: '', date: '', transport: 'Flight', notes: '' });
                setShowForm(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#e2e8f0] hover:border-[#0d9488] text-slate-500 hover:text-[#0d9488] font-semibold rounded-2xl transition-all bg-white"
            >
              <Plus className="w-5 h-5" />
              <span>Add another Stop / Destination</span>
            </button>
          )}

          {/* Inline Form to Add/Edit Stops */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-heading text-[#0f172a]">
                {editingStopId ? 'Edit Stop / Destination' : 'Add Stop / Destination'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location Input */}
                <div className="space-y-1">
                  <label htmlFor="location" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Stop Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={stopForm.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Louvre Museum or Rome Center"
                    className={`w-full px-4 py-2.5 bg-white border rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                      errors.location ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                    }`}
                  />
                  {errors.location && (
                    <p className="text-xs text-[#dc2626] font-medium mt-1">{errors.location}</p>
                  )}
                </div>

                {/* Date Picker (Restricted between start & end trip dates) */}
                <div className="space-y-1">
                  <label htmlFor="date" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date of Stop
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={stopForm.date}
                    onChange={handleInputChange}
                    min={trip.startDate}
                    max={trip.endDate}
                    className={`w-full px-4 py-2.5 bg-white border rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                      errors.date ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                    }`}
                  />
                  {errors.date && (
                    <p className="text-xs text-[#dc2626] font-medium mt-1">{errors.date}</p>
                  )}
                </div>
              </div>

              {/* Transport selection cards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Transport to this Stop
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['Flight', 'Train', 'Car'].map(mode => {
                    const isSelected = stopForm.transport === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => selectTransport(mode)}
                        className={`py-2 px-4 border rounded-[10px] text-xs font-semibold text-center transition-all ${
                          isSelected 
                            ? 'border-[#0d9488] bg-[#f0fdfa] text-[#0d9488]' 
                            : 'border-[#e2e8f0] bg-white text-[#475569] hover:bg-slate-50'
                        }`}
                      >
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stop Notes */}
              <div className="space-y-1">
                <label htmlFor="notes" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Notes / Description
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={stopForm.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="e.g. Flight CDG CDG929, Check-in at 2 PM"
                  className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] focus:border-[#0d9488] rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStopId(null);
                    setStopForm({ location: '', date: '', transport: 'Flight', notes: '' });
                    setShowForm(false);
                  }}
                  className="px-4 py-2 border border-[#e2e8f0] text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-[10px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-[10px] shadow-sm transition-all"
                >
                  {editingStopId ? 'Update Stop' : 'Add Stop'}
                </button>
              </div>
            </form>
          )}

          {/* List of stops */}
          <div className="space-y-4">
            {sortedStops.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center shadow-sm">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold font-heading text-[#0f172a]">No stops added yet</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  Add stops/destinations to set up the daily chronology of your itinerary.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedStops.map((stop, index) => {
                  const TransportIcon = getTransportIcon(stop.transport);
                  return (
                    <div key={stop.id} className="relative">
                      {/* Chronological Connector Line */}
                      {index < sortedStops.length - 1 && (
                        <div className="absolute left-8 top-20 bottom-[-20px] w-0.5 bg-slate-200 z-0"></div>
                      )}

                      <div className="relative bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm flex items-start gap-4 z-10 hover:border-slate-300 transition-colors">
                        
                        {/* Transit marker circle */}
                        <div className="w-12 h-12 rounded-full bg-[#f0fdfa] text-[#0d9488] border border-teal-100 flex items-center justify-center shrink-0">
                          <TransportIcon className="w-5 h-5" />
                        </div>

                        {/* Details */}
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-base font-bold text-[#0f172a]">{stop.location}</h4>
                              <span className="text-xs font-semibold text-[#0d9488]">
                                {formatDate(stop.date)}
                              </span>
                            </div>
                            
                            {/* Stop Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditClick(stop)}
                                className="p-1.5 text-slate-500 hover:text-[#0d9488] hover:bg-slate-50 rounded-[10px] transition-colors"
                                aria-label="Edit stop"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(stop.id)}
                                className="p-1.5 text-slate-500 hover:text-[#dc2626] hover:bg-slate-50 rounded-[10px] transition-colors"
                                aria-label="Delete stop"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {stop.notes && (
                            <p className="text-sm text-slate-500 flex items-start gap-1.5 pt-2 border-t border-slate-100 mt-2">
                              <StickyNote className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <span>{stop.notes}</span>
                            </p>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </section>

        {/* MAP PLACEHOLDER & PLANNING TIPS (RIGHT) */}
        <aside className="space-y-6">
          
          {/* Map Placeholder Panel */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2e8f0] pb-2 flex items-center gap-2">
              <Map className="w-4 h-4 text-[#0d9488]" />
              Visual route map
            </h3>
            
            <div className="relative h-64 bg-slate-50 border border-dashed border-[#e2e8f0] rounded-2xl overflow-hidden flex flex-col justify-between p-4">
              
              {/* Compass overlay graphic */}
              <div className="absolute right-4 top-4 text-slate-200">
                <Compass className="w-16 h-16 opacity-30" />
              </div>

              {sortedStops.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-6">
                  <p className="text-xs text-slate-400 italic">Add stops to trace your journey routes.</p>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-start space-y-4 overflow-y-auto pt-2">
                  {sortedStops.map((s, i) => (
                    <div key={s.id} className="relative flex items-center gap-3">
                      {/* Connection Line */}
                      {i < sortedStops.length - 1 && (
                        <div className="absolute left-2.5 top-6 bottom-[-20px] w-0.5 border-l-2 border-dashed border-teal-200"></div>
                      )}
                      
                      {/* Dot */}
                      <div className="w-5 h-5 rounded-full bg-[#0d9488] border-2 border-white flex items-center justify-center shadow shrink-0 z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      
                      {/* Label */}
                      <div className="text-xs">
                        <span className="font-semibold text-slate-700 block truncate max-w-[180px]">{s.location}</span>
                        <span className="text-[10px] text-slate-400 block">{formatDate(s.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-slate-400 bg-white border border-[#e2e8f0] px-2 py-1 rounded-[10px] self-start z-10 shadow-sm mt-2">
                Route Preview (Mock Map View)
              </div>
            </div>
          </div>

          {/* Planning Tips */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4 font-body">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
              Planning tips
            </h3>
            <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0 mt-1.5"></div>
                <span>Add 2–3 activities per stop to keep a balanced, enjoyable pace.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0 mt-1.5"></div>
                <span>Leave buffer time between stops to handle flight or train delays.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0 mt-1.5"></div>
                <span>Plan transport preferences (Flight, Train, Car) to keep schedules accurate.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0 mt-1.5"></div>
                <span>Ensure stop dates fall within your trip's start and end date ceiling.</span>
              </li>
            </ul>
          </div>

        </aside>

      </div>

    </main>
  );
}
