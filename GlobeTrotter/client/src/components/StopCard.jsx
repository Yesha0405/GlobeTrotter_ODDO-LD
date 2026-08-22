import { MapPin, Plane, Train, Car, Bus, Edit3, Trash2, PlusCircle, StickyNote } from 'lucide-react';
import { formatDate } from '../utils/date';

export default function StopCard({ stop, onEdit, onDelete, onAddActivity, children }) {
  if (!stop) return null;

  const getTransportIcon = (type) => {
    switch (type) {
      case 'Flight': return Plane;
      case 'Train': return Train;
      case 'Car': return Car;
      default: return Bus;
    }
  };

  const TransportIcon = getTransportIcon(stop.transport);

  return (
    <div className="relative border border-[#e2e8f0] bg-white rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors font-body">
      
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          {/* Transport Icon Circle */}
          <div className="w-10 h-10 rounded-full bg-[#f0fdfa] text-[#0d9488] border border-teal-100 flex items-center justify-center shrink-0">
            <TransportIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#0f172a]">{stop.location}</h4>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#0d9488]" />
              <span>Stop planned for {formatDate(stop.date)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {onAddActivity && (
            <button
              onClick={onAddActivity}
              className="p-1.5 text-slate-500 hover:text-[#0d9488] hover:bg-slate-50 rounded-[10px] transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Add activity to this stop"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Activity</span>
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 text-slate-500 hover:text-[#0d9488] hover:bg-slate-50 rounded-[10px] transition-colors"
              aria-label="Edit Stop"
              title="Edit Stop"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 text-slate-500 hover:text-[#dc2626] hover:bg-slate-50 rounded-[10px] transition-colors"
              aria-label="Delete Stop"
              title="Delete Stop"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Optional Stop Notes */}
      {stop.notes && (
        <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-[10px] text-xs text-slate-500 border border-slate-100">
          <StickyNote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{stop.notes}</span>
        </div>
      )}

      {/* Nested Activities Section */}
      {children && (
        <div className="pl-6 border-l border-dashed border-[#e2e8f0] space-y-3 pt-2 mt-2">
          {children}
        </div>
      )}
      
    </div>
  );
}
