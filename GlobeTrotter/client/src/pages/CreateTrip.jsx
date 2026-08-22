import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { getTripDuration, formatDate } from '../utils/date';
import { 
  ArrowLeft, 
  MapPin, 
  CalendarDays, 
  Users, 
  Plane, 
  Train, 
  Car, 
  AlertCircle, 
  Plus, 
  Minus,
  Wallet
} from 'lucide-react';

export default function CreateTrip() {
  const { addTrip } = useTrip();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    transport: 'Flight',
    budget: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ==================================================
  // 1. DYNAMIC DURATION CALCULATION
  // ==================================================
  const durationText = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return null;
    const days = getTripDuration(formData.startDate, formData.endDate);
    if (days <= 0) return null;
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }, [formData.startDate, formData.endDate]);

  // ==================================================
  // 2. INPUT CHANGE HANDLERS
  // ==================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTravelersChange = (increment) => {
    setFormData(prev => {
      const nextVal = prev.travelers + (increment ? 1 : -1);
      if (nextVal >= 1 && nextVal <= 20) {
        return { ...prev, travelers: nextVal };
      }
      return prev;
    });
  };

  const selectTransport = (mode) => {
    setFormData(prev => ({ ...prev, transport: mode }));
  };

  // ==================================================
  // 3. FORM VALIDATION
  // ==================================================
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.title.trim()) {
      tempErrors.title = 'Trip name is required.';
    }
    if (!formData.destination.trim()) {
      tempErrors.destination = 'Destination is required.';
    }
    if (!formData.startDate) {
      tempErrors.startDate = 'Start date is required.';
    }
    if (!formData.endDate) {
      tempErrors.endDate = 'End date is required.';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      tempErrors.endDate = 'End date must be on or after the start date.';
    }
    if (formData.budget !== '' && (isNaN(parseFloat(formData.budget)) || parseFloat(formData.budget) < 0)) {
      tempErrors.budget = 'Budget must be a positive number.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Helper to map realistic Unsplash covers for major destinations
  const getCoverImageForDestination = (destination) => {
    const dest = destination.toLowerCase();
    if (dest.includes('paris') || dest.includes('france')) {
      return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80';
    }
    if (dest.includes('tokyo') || dest.includes('japan')) {
      return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80';
    }
    if (dest.includes('zermatt') || dest.includes('swiss') || dest.includes('alps') || dest.includes('ski')) {
      return 'https://images.unsplash.com/photo-1482867996988-2faec3cbb4f9?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
  };

  // ==================================================
  // 4. SUBMISSION ACTION
  // ==================================================
 const handleSubmit = async (e) => {
  e.preventDefault();

  setSubmitError(null);

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const newTrip = await addTrip({
      title: formData.title.trim(),
      destination: formData.destination.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget:
        formData.budget !== ""
          ? parseFloat(formData.budget)
          : 0
    });

    navigate(
      `/build-itinerary/${newTrip.id}`
    );

  } catch (err) {

    console.error(err);

    setSubmitError(
      err.message ||
      "We could not create your trip."
    );

  } finally {

    setIsSubmitting(false);

  }
};
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-body">
      
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
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-heading text-[#0f172a]">
            Plan your next adventure
          </h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Tell us a few details about your trip and we'll help you organize the journey.
          </p>
        </div>
      </header>

      {/* ==================================================
          MAIN LAYOUT: FORM & PREVIEW
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* FORM PANEL (LEFT) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-sm text-[#dc2626] font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Section 1: Trip Details */}
          <fieldset className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4">
            <legend className="text-base font-bold font-heading text-[#0f172a] px-1 mb-2">Trip Details</legend>
            
            {/* Trip Name */}
            <div className="space-y-1">
              <label htmlFor="title" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Trip Name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. European Summer Escape"
                className={`w-full px-4 py-2.5 bg-white border rounded-[10px] text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                  errors.title ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Destination */}
            <div className="space-y-1">
              <label htmlFor="destination" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Paris, France"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-[10px] text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                    errors.destination ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                  }`}
                />
              </div>
              {errors.destination && (
                <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.destination}
                </p>
              )}
            </div>
          </fieldset>

          {/* Section 2: Dates */}
          <fieldset className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4">
            <legend className="text-base font-bold font-heading text-[#0f172a] px-1 mb-2">Schedule</legend>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-1">
                <label htmlFor="startDate" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-white border rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                    errors.startDate ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label htmlFor="endDate" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-white border rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                    errors.endDate ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                  }`}
                />
                {errors.endDate && (
                  <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Live Duration Preview */}
            {durationText && (
              <div className="flex items-center gap-2 p-3 bg-[#f0fdfa] rounded-[10px] text-xs font-semibold text-[#0d9488] border border-teal-100">
                <CalendarDays className="w-4 h-4" />
                <span>Calculated Trip Length: {durationText}</span>
              </div>
            )}
          </fieldset>

          {/* Section 3: Preferences */}
          <fieldset className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-6">
            <legend className="text-base font-bold font-heading text-[#0f172a] px-1 mb-2">Preferences</legend>
            
            {/* Travelers Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Group Size / Travelers
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTravelersChange(false)}
                  disabled={formData.travelers <= 1}
                  className="w-10 h-10 flex items-center justify-center border border-[#e2e8f0] hover:border-slate-400 disabled:opacity-40 disabled:hover:border-[#e2e8f0] bg-white rounded-[10px] text-[#475569] transition-all"
                  aria-label="Decrease traveler count"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 border border-[#e2e8f0] px-6 py-2 rounded-[10px] bg-slate-50 font-semibold text-[#0f172a] min-w-[140px] justify-center text-sm">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{formData.travelers} {formData.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTravelersChange(true)}
                  disabled={formData.travelers >= 20}
                  className="w-10 h-10 flex items-center justify-center border border-[#e2e8f0] hover:border-slate-400 disabled:opacity-40 disabled:hover:border-[#e2e8f0] bg-white rounded-[10px] text-[#475569] transition-all"
                  aria-label="Increase traveler count"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Transport Mode */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Preferred Mode of Transport
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { mode: 'Flight', icon: Plane },
                  { mode: 'Train', icon: Train },
                  { mode: 'Car', icon: Car }
                ].map(item => {
                  const isSelected = formData.transport === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => selectTransport(item.mode)}
                      className={`flex flex-col items-center gap-2 p-4 border rounded-2xl transition-all duration-150 ${
                        isSelected 
                          ? 'border-[#0d9488] bg-[#f0fdfa] text-[#0d9488]' 
                          : 'border-[#e2e8f0] bg-white text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-xs font-semibold">{item.mode}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </fieldset>

          {/* Section 4: Budget */}
          <fieldset className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4">
            <legend className="text-base font-bold font-heading text-[#0f172a] px-1 mb-2">Budgeting</legend>
            
            <div className="space-y-1">
              <label htmlFor="budget" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Trip Budget (USD)
              </label>
              <div className="relative">
                <Wallet className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. 2500"
                  min="0"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-[10px] text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                    errors.budget ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                  }`}
                />
              </div>
              {errors.budget && (
                <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.budget}
                </p>
              )}
            </div>
          </fieldset>

          {/* Bottom Actions */}
          <div className="flex items-center gap-4 justify-end pt-2">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 border border-[#e2e8f0] text-slate-700 hover:text-[#0f172a] hover:bg-slate-50 text-sm font-semibold rounded-[10px] transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] disabled:opacity-60 text-white text-sm font-semibold rounded-[10px] shadow-sm transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Trip</span>
              )}
            </button>
          </div>

        </form>

        {/* LIVE TRIP PREVIEW (RIGHT) */}
        <aside className="sticky top-24 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
            Live Preview
          </h3>
          
          <div className="space-y-4">
            {/* Visual background wrapper */}
            <div className="h-32 rounded-2xl bg-gradient-to-tr from-teal-500 to-slate-800 flex items-center justify-center p-4 text-white text-center font-heading font-bold text-lg">
              {formData.title.trim() || 'Your Adventure'}
            </div>

            <div className="space-y-3 text-sm text-[#0f172a]">
              {/* Destination */}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className={formData.destination.trim() ? 'font-semibold' : 'text-slate-400 italic'}>
                  {formData.destination.trim() || 'Destination not selected'}
                </span>
              </div>

              {/* Dates / Duration */}
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                <span className={formData.startDate && formData.endDate ? 'font-semibold' : 'text-slate-400 italic'}>
                  {formData.startDate && formData.endDate 
                    ? `${formatDate(formData.startDate)} — ${formatDate(formData.endDate)}`
                    : 'Dates not specified'
                  }
                  {durationText && ` (${durationText})`}
                </span>
              </div>

              {/* Travelers */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold">
                  {formData.travelers} {formData.travelers === 1 ? 'Traveler' : 'Travelers'}
                </span>
              </div>

              {/* Transport */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-semibold uppercase w-20">Transport:</span>
                <span className="font-semibold text-[#0d9488] bg-[#f0fdfa] px-2 py-0.5 rounded-[10px] text-xs border border-teal-100">
                  {formData.transport}
                </span>
              </div>

              {/* Budget */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <span className="text-slate-400 text-xs font-semibold uppercase w-20">Budget:</span>
                <span className="font-bold">
                  {formData.budget !== '' && parseFloat(formData.budget) >= 0
                    ? `USD $${parseFloat(formData.budget).toLocaleString()}`
                    : 'No budget allocated'
                  }
                </span>
              </div>
            </div>
          </div>
        </aside>

      </div>

    </main>
  );
}
