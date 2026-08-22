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

  const {
    trips,
    addStopToTrip
  } = useTrip();

  // ============================================
  // FIND CURRENT TRIP
  // ============================================

  const trip = useMemo(() => {
    return trips.find(
      (t) => String(t.id) === String(tripId)
    ) || null;
  }, [trips, tripId]);

  // ============================================
  // FORM STATE
  // ============================================

  const [stopForm, setStopForm] = useState({
    location: '',
    date: '',
    transport: 'Flight',
    notes: ''
  });

  const [editingStopId, setEditingStopId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  // ============================================
  // SORT STOPS
  // ============================================

  const sortedStops = useMemo(() => {
    if (!trip || !trip.stops) return [];

    return [...trip.stops].sort((a, b) => {
      const dateA = new Date(
        a.start_date || a.date
      );

      const dateB = new Date(
        b.start_date || b.date
      );

      return dateA - dateB;
    });
  }, [trip]);

  // ============================================
  // LOADING / TRIP NOT FOUND
  // ============================================

  if (!trip) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center font-body space-y-4">
        <AlertCircle className="w-12 h-12 text-[#dc2626] mx-auto" />

        <h2 className="text-2xl font-bold font-heading text-[#0f172a]">
          Trip Not Found
        </h2>

        <p className="text-slate-500">
          We couldn't locate the travel itinerary you requested.
        </p>

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

  // ============================================
  // TRIP DATA
  // ============================================

  const tripStartDate =
    trip.startDate || trip.start_date;

  const tripEndDate =
    trip.endDate || trip.end_date;

  const duration = getTripDuration(
    tripStartDate,
    tripEndDate
  );

  const durationText =
    duration > 0
      ? `${duration} ${duration === 1 ? 'day' : 'days'}`
      : '';

  // ============================================
  // INPUT HANDLING
  // ============================================

  const handleInputChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setStopForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ============================================
  // TRANSPORT SELECTION
  // ============================================

  const selectTransport = (mode) => {
    setStopForm((prev) => ({
      ...prev,
      transport: mode
    }));
  };

  // ============================================
  // FORM VALIDATION
  // ============================================

  const validateForm = () => {
    const tempErrors = {};

    if (!stopForm.location.trim()) {
      tempErrors.location =
        'Stop location or title is required.';
    }

    if (!stopForm.date) {
      tempErrors.date =
        'Date is required.';
    } else {
      const selectedDate =
        new Date(stopForm.date);

      const startDate =
        new Date(tripStartDate);

      const endDate =
        new Date(tripEndDate);

      if (
        selectedDate < startDate ||
        selectedDate > endDate
      ) {
        tempErrors.date =
          `Date must fall within the trip range (${formatDate(
            tripStartDate
          )} to ${formatDate(tripEndDate)}).`;
      }
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  // ============================================
  // ADD STOP
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // ----------------------------------------
      // EDIT NOT SUPPORTED BY CURRENT BACKEND
      // ----------------------------------------

      if (editingStopId) {
        alert(
          'Editing stops is not available yet. ' +
          'Please remove and re-add the stop if needed.'
        );

        setEditingStopId(null);
        setShowForm(false);

        return;
      }

      // ----------------------------------------
      // ADD STOP TO BACKEND
      // ----------------------------------------

      await addStopToTrip(trip.id, {
        location: stopForm.location.trim(),
        date: stopForm.date,
        transport: stopForm.transport,
        notes: stopForm.notes.trim()
      });

      // ----------------------------------------
      // RESET FORM
      // ----------------------------------------

      setStopForm({
        location: '',
        date: '',
        transport: 'Flight',
        notes: ''
      });

      setErrors({});
      setEditingStopId(null);
      setShowForm(false);

    } catch (error) {
      console.error(
        'Failed to add stop:',
        error
      );

      setErrors({
        location:
          error.message ||
          'Failed to add this stop.'
      });
    }
  };

  // ============================================
  // EDIT STOP
  // ============================================

  const handleEditClick = () => {
    alert(
      'Editing stops is not available yet. ' +
      'You can add new destinations.'
    );
  };

  // ============================================
  // DELETE STOP
  // ============================================

  const handleDeleteClick = () => {
    alert(
      'Deleting stops is not available yet. ' +
      'You can add new destinations.'
    );
  };

  // ============================================
  // TRANSPORT ICON
  // ============================================

  const getTransportIcon = (type) => {
    switch (type) {
      case 'Flight':
        return Plane;

      case 'Train':
        return Train;

      case 'Car':
        return Car;

      default:
        return Bus;
    }
  };

  // ============================================
  // RENDER
  // ============================================

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
          TRIP OVERVIEW
          ================================================== */}

      <section className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-wrap gap-y-4 gap-x-8 items-center text-sm text-[#0f172a]">

        {/* Destination */}

        <div className="flex items-center gap-2">

          <MapPin className="w-4 h-4 text-[#0d9488]" />

          <div>

            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Destination
            </span>

            <span className="font-semibold">
              {trip.destination ||
                trip.name ||
                'Trip'}
            </span>

          </div>

        </div>

        {/* Dates */}

        <div className="flex items-center gap-2">

          <CalendarDays className="w-4 h-4 text-slate-400" />

          <div>

            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Dates
            </span>

            <span className="font-semibold">
              {formatDate(tripStartDate)}
              {' – '}
              {formatDate(tripEndDate)}
            </span>

          </div>

        </div>

        {/* Duration */}

        <div className="flex items-center gap-2">

          <Compass className="w-4 h-4 text-slate-400" />

          <div>

            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Duration
            </span>

            <span className="font-semibold">
              {durationText}
            </span>

          </div>

        </div>

        {/* Travelers */}

        <div className="flex items-center gap-2">

          <Users className="w-4 h-4 text-slate-400" />

          <div>

            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Travelers
            </span>

            <span className="font-semibold">
              {trip.travelers || 1} Guests
            </span>

          </div>

        </div>

        {/* Budget */}

        {Number(trip.budget || 0) > 0 && (

          <div className="flex items-center gap-2">

            <Wallet className="w-4 h-4 text-slate-400" />

            <div>

              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Budget
              </span>

              <span className="font-semibold">
                {trip.currency || 'INR'}{' '}
                {Number(trip.budget).toLocaleString()}
              </span>

            </div>

          </div>

        )}

      </section>

      {/* ==================================================
          MAIN LAYOUT
          ================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ==================================================
            BUILDER
            ================================================== */}

        <section className="lg:col-span-2 space-y-6">

          {/* Add Stop Button */}

          {!showForm && (

            <button
              onClick={() => {

                setEditingStopId(null);

                setStopForm({
                  location: '',
                  date: '',
                  transport: 'Flight',
                  notes: ''
                });

                setErrors({});

                setShowForm(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#e2e8f0] hover:border-[#0d9488] text-slate-500 hover:text-[#0d9488] font-semibold rounded-2xl transition-all bg-white"
            >

              <Plus className="w-5 h-5" />

              <span>
                Add another Stop / Destination
              </span>

            </button>

          )}

          {/* ==================================================
              ADD STOP FORM
              ================================================== */}

          {showForm && (

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4"
            >

              <h3 className="text-base font-bold font-heading text-[#0f172a]">
                Add Stop / Destination
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Location */}

                <div className="space-y-1">

                  <label
                    htmlFor="location"
                    className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Stop Location
                  </label>

                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={stopForm.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Jaipur"
                    className={`w-full px-4 py-2.5 bg-white border rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                      errors.location
                        ? 'border-[#dc2626] focus:border-[#dc2626]'
                        : 'border-[#e2e8f0] focus:border-[#0d9488]'
                    }`}
                  />

                  {errors.location && (

                    <p className="text-xs text-[#dc2626] font-medium mt-1">
                      {errors.location}
                    </p>

                  )}

                </div>

                {/* Date */}

                <div className="space-y-1">

                  <label
                    htmlFor="date"
                    className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
                  >
                    Date of Stop
                  </label>

                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={stopForm.date}
                    onChange={handleInputChange}
                    min={tripStartDate}
                    max={tripEndDate}
                    className={`w-full px-4 py-2.5 bg-white border rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                      errors.date
                        ? 'border-[#dc2626] focus:border-[#dc2626]'
                        : 'border-[#e2e8f0] focus:border-[#0d9488]'
                    }`}
                  />

                  {errors.date && (

                    <p className="text-xs text-[#dc2626] font-medium mt-1">
                      {errors.date}
                    </p>

                  )}

                </div>

              </div>

              {/* ==================================================
                  TRANSPORT
                  ================================================== */}

              <div className="space-y-3">

                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Transport to this Stop
                </label>

                <div className="grid grid-cols-3 gap-4">

                  {[
                    'Flight',
                    'Train',
                    'Car'
                  ].map((mode) => {

                    const isSelected =
                      stopForm.transport === mode;

                    return (

                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          selectTransport(mode)
                        }
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

              {/* ==================================================
                  NOTES
                  ================================================== */}

              <div className="space-y-1">

                <label
                  htmlFor="notes"
                  className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  Notes / Description
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  value={stopForm.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="e.g. Flight details, hotel check-in, etc."
                  className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] focus:border-[#0d9488] rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
                />

              </div>

              {/* ==================================================
                  FORM ACTIONS
                  ================================================== */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => {

                    setEditingStopId(null);

                    setStopForm({
                      location: '',
                      date: '',
                      transport: 'Flight',
                      notes: ''
                    });

                    setErrors({});
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
                  Add Stop
                </button>

              </div>

            </form>

          )}

          {/* ==================================================
              STOP LIST
              ================================================== */}

          <div className="space-y-4">

            {sortedStops.length === 0 ? (

              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center shadow-sm">

                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />

                <h3 className="text-lg font-bold font-heading text-[#0f172a]">
                  No stops added yet
                </h3>

                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  Add stops/destinations to set up the daily chronology of your itinerary.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {sortedStops.map((stop, index) => {

                  const TransportIcon =
                    getTransportIcon(
                      stop.transport
                    );

                  const stopName =
                    stop.city_name ||
                    stop.location ||
                    'Unknown destination';

                  const stopDate =
                    stop.start_date ||
                    stop.date;

                  return (

                    <div
                      key={stop.id}
                      className="relative"
                    >

                      {/* Connector */}

                      {index <
                        sortedStops.length - 1 && (

                        <div className="absolute left-8 top-20 bottom-[-20px] w-0.5 bg-slate-200 z-0"></div>

                      )}

                      <div className="relative bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm flex items-start gap-4 z-10 hover:border-slate-300 transition-colors">

                        {/* Transport marker */}

                        <div className="w-12 h-12 rounded-full bg-[#f0fdfa] text-[#0d9488] border border-teal-100 flex items-center justify-center shrink-0">

                          <TransportIcon className="w-5 h-5" />

                        </div>

                        {/* Details */}

                        <div className="flex-grow space-y-1">

                          <div className="flex justify-between items-start gap-4">

                            <div>

                              <h4 className="text-base font-bold text-[#0f172a]">
                                {stopName}
                              </h4>

                              <span className="text-xs font-semibold text-[#0d9488]">
                                {formatDate(stopDate)}
                              </span>

                            </div>

                            {/* Actions */}

                            <div className="flex items-center gap-2">

                              <button
                                onClick={() =>
                                  handleEditClick(stop)
                                }
                                className="p-1.5 text-slate-500 hover:text-[#0d9488] hover:bg-slate-50 rounded-[10px] transition-colors"
                                aria-label="Edit stop"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteClick(stop.id)
                                }
                                className="p-1.5 text-slate-500 hover:text-[#dc2626] hover:bg-slate-50 rounded-[10px] transition-colors"
                                aria-label="Delete stop"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                            </div>

                          </div>

                          {/* City information */}

                          {stop.country && (

                            <p className="text-xs text-slate-400">
                              {stop.city_name}
                              {stop.region
                                ? `, ${stop.region}`
                                : ''}
                              {stop.country
                                ? `, ${stop.country}`
                                : ''}
                            </p>

                          )}

                          {/* Notes */}

                          {stop.notes && (

                            <p className="text-sm text-slate-500 flex items-start gap-1.5 pt-2 border-t border-slate-100 mt-2">

                              <StickyNote className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />

                              <span>
                                {stop.notes}
                              </span>

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

        {/* ==================================================
            RIGHT SIDEBAR
            ================================================== */}

        <aside className="space-y-6">

          {/* ==================================================
              MAP PREVIEW
              ================================================== */}

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4">

            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2e8f0] pb-2 flex items-center gap-2">

              <Map className="w-4 h-4 text-[#0d9488]" />

              Visual route map

            </h3>

            <div className="relative h-64 bg-slate-50 border border-dashed border-[#e2e8f0] rounded-2xl overflow-hidden flex flex-col justify-between p-4">

              <div className="absolute right-4 top-4 text-slate-200">

                <Compass className="w-16 h-16 opacity-30" />

              </div>

              {sortedStops.length === 0 ? (

                <div className="h-full flex items-center justify-center text-center p-6">

                  <p className="text-xs text-slate-400 italic">
                    Add stops to trace your journey routes.
                  </p>

                </div>

              ) : (

                <div className="h-full flex flex-col justify-start space-y-4 overflow-y-auto pt-2">

                  {sortedStops.map((stop, index) => {

                    const stopName =
                      stop.city_name ||
                      stop.location ||
                      'Unknown destination';

                    const stopDate =
                      stop.start_date ||
                      stop.date;

                    return (

                      <div
                        key={stop.id}
                        className="relative flex items-center gap-3"
                      >

                        {index <
                          sortedStops.length - 1 && (

                          <div className="absolute left-2.5 top-6 bottom-[-20px] w-0.5 border-l-2 border-dashed border-teal-200"></div>

                        )}

                        <div className="w-5 h-5 rounded-full bg-[#0d9488] border-2 border-white flex items-center justify-center shadow shrink-0 z-10">

                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>

                        </div>

                        <div className="text-xs">

                          <span className="font-semibold text-slate-700 block truncate max-w-[180px]">
                            {stopName}
                          </span>

                          <span className="text-[10px] text-slate-400 block">
                            {formatDate(stopDate)}
                          </span>

                        </div>

                      </div>

                    );

                  })}

                </div>

              )}

              <div className="text-[10px] text-slate-400 bg-white border border-[#e2e8f0] px-2 py-1 rounded-[10px] self-start z-10 shadow-sm mt-2">

                Route Preview (Mock Map View)

              </div>

            </div>

          </div>

          {/* ==================================================
              PLANNING TIPS
              ================================================== */}

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4 font-body">

            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
              Planning tips
            </h3>

            <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">

              <li className="flex items-start gap-2">

                <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0 mt-1.5"></div>

                <span>
                  Add 2–3 activities per stop to keep a balanced, enjoyable pace.
                </span>

              </li>

              <li className="flex items-start gap-2">

                <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0 mt-1.5"></div>

                <span>
                  Leave buffer time between stops to handle flight or train delays.
                </span>

              </li>

              <li className="flex items-start gap-2">

                <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0 mt-1.5"></div>

                <span>
                  Plan transport preferences (Flight, Train, Car) to keep schedules accurate.
                </span>

              </li>

              <li className="flex items-start gap-2">

                <div className="w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0 mt-1.5"></div>

                <span>
                  Ensure stop dates fall within your trip's start and end date ceiling.
                </span>

              </li>

            </ul>

          </div>

        </aside>

      </div>

    </main>
  );
}