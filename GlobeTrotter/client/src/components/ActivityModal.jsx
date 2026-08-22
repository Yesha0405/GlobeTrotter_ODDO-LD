import { useState, useEffect } from 'react';
import { X, Clock, Tag, DollarSign, AlertCircle } from 'lucide-react';

export default function ActivityModal({ isOpen, onClose, onSave, activityData }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Sightseeing',
    time: '',
    duration: '',
    price: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  // Sync state if editing an existing activity
  useEffect(() => {
    if (activityData) {
      setFormData({
        name: activityData.name || '',
        type: activityData.type || 'Sightseeing',
        time: activityData.time || '',
        duration: activityData.duration !== undefined ? activityData.duration.toString() : '',
        price: activityData.price !== undefined ? activityData.price.toString() : '',
        description: activityData.description || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'Sightseeing',
        time: '',
        duration: '',
        price: '',
        description: ''
      });
    }
    setErrors({});
  }, [activityData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = 'Activity name is required.';
    }
    if (formData.duration !== '' && (isNaN(parseInt(formData.duration, 10)) || parseInt(formData.duration, 10) <= 0)) {
      tempErrors.duration = 'Duration must be a positive integer in minutes.';
    }
    if (formData.price !== '' && (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0)) {
      tempErrors.price = 'Price must be a positive number.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      name: formData.name.trim(),
      type: formData.type,
      time: formData.time || null,
      duration: formData.duration !== '' ? parseInt(formData.duration, 10) : 0,
      price: formData.price !== '' ? parseFloat(formData.price) : 0,
      description: formData.description.trim() || null
    });
  };

  const categories = ['Sightseeing', 'Museum', 'Food', 'Lodging', 'Rental', 'Transport', 'Other'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-body animate-fade-in">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h3 className="text-lg font-bold font-heading text-[#0f172a]">
            {activityData ? 'Edit Activity Details' : 'Add New Activity'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-[10px] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          
          {/* Name Field */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Activity Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Guided Louvre Tour or Eiffel Tower Visit"
              className={`w-full px-4 py-2 bg-white border rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                errors.name ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category selection */}
            <div className="space-y-1">
              <label htmlFor="type" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Category / Type
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#e2e8f0] focus:border-[#0d9488] rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Picker */}
            <div className="space-y-1">
              <label htmlFor="time" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#e2e8f0] focus:border-[#0d9488] rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration (minutes) */}
            <div className="space-y-1">
              <label htmlFor="duration" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 90 or 120"
                min="1"
                className={`w-full px-4 py-2 bg-white border rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                  errors.duration ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                }`}
              />
              {errors.duration && (
                <p className="text-xs text-[#dc2626] font-medium mt-1">{errors.duration}</p>
              )}
            </div>

            {/* Price (number) */}
            <div className="space-y-1">
              <label htmlFor="price" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Price / Cost (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 45"
                  min="0"
                  step="any"
                  className={`w-full pl-10 pr-4 py-2 bg-white border rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                    errors.price ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-xs text-[#dc2626] font-medium mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="description" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Provide a brief description of the activity (meeting points, instructions, etc.)"
              className="w-full px-4 py-2 bg-white border border-[#e2e8f0] focus:border-[#0d9488] rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e2e8f0] text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-[10px] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-[10px] shadow-sm transition-all"
            >
              {activityData ? 'Save Changes' : 'Add Activity'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
