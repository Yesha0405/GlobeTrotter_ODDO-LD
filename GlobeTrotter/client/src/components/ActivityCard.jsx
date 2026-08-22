import { Clock, Tag, DollarSign, Edit3, Trash2, CalendarDays } from 'lucide-react';

export default function ActivityCard({ activity, onEdit, onDelete }) {
  if (!activity) return null;

  // Format duration into readable hours/minutes
  const formatDuration = (mins) => {
    const val = parseInt(mins, 10);
    if (isNaN(val) || val <= 0) return '';
    if (val < 60) return `${val}m`;
    const hrs = Math.floor(val / 60);
    const remainingMins = val % 60;
    return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
  };

  const durationText = formatDuration(activity.duration);

  return (
    <div className="group bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:bg-slate-100/50 hover:border-slate-300 transition-colors font-body relative">
      
      {/* Name and Actions */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h5 className="text-sm font-bold text-[#0f172a]">{activity.name}</h5>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            {activity.type && (
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                {activity.type}
              </span>
            )}
            {activity.time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {activity.time}
              </span>
            )}
            {durationText && (
              <span className="flex items-center gap-0.5">
                • {durationText}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-slate-400 hover:text-[#0d9488] hover:bg-white rounded-[6px] border border-transparent hover:border-slate-200 transition-all"
              aria-label="Edit Activity"
              title="Edit Activity"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-slate-400 hover:text-[#dc2626] hover:bg-white rounded-[6px] border border-transparent hover:border-slate-200 transition-all"
              aria-label="Delete Activity"
              title="Delete Activity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {activity.description && (
        <p className="text-xs text-slate-500 leading-relaxed font-normal">
          {activity.description}
        </p>
      )}

      {/* Price tag summary */}
      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-200/60 mt-1">
        <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          {activity.price !== undefined && parseFloat(activity.price) > 0
            ? `$${parseFloat(activity.price).toLocaleString()}`
            : 'Free / Included'
          }
        </span>
      </div>

    </div>
  );
}
