import { Wallet, AlertCircle, Percent } from 'lucide-react';

export default function BudgetCard({ budget, spent, remaining, percentage, status, currency = 'INR' }) {
  const budgetColors = {
    safe: { text: 'text-[#059669]', bg: 'bg-emerald-50 border-emerald-100', progress: 'bg-[#059669]' },
    warning: { text: 'text-[#d97706]', bg: 'bg-amber-50 border-amber-100', progress: 'bg-[#d97706]' },
    over: { text: 'text-[#dc2626]', bg: 'bg-red-50 border-red-200', progress: 'bg-[#dc2626]' }
  };

  const activeColor = budgetColors[status] || budgetColors.safe;

  const formatCurrency = (value) => {
    if (currency === 'INR') {
      return `₹${value.toLocaleString('en-IN')}`;
    }
    const symbol = currency === 'USD' ? '$' : '';
    return `${currency} ${symbol}${value.toLocaleString()}`;
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-5 font-body">
      {/* Header */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2e8f0] pb-2 flex items-center gap-2">
        <Wallet className="w-4 h-4 text-[#0d9488]" />
        Budget Overview
      </h3>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-[10px]">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Total Budget
          </span>
          <span className="text-sm text-[#0f172a] font-bold">
            {formatCurrency(budget)}
          </span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-[10px]">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Total Spent
          </span>
          <span className="text-sm text-[#0f172a] font-bold">
            {formatCurrency(spent)}
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-500 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-slate-400" />
            Budget Spent
          </span>
          <span className={activeColor.text}>{percentage}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${activeColor.progress}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Budget Status Banner */}
      <div className={`p-4 border rounded-2xl text-xs flex gap-2 items-start ${activeColor.bg}`}>
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block capitalize">Budget Status: {status}</span>
          <span className="text-slate-500 block mt-0.5">
            {status === 'over' 
              ? 'Your expenses have exceeded your allocated budget ceiling.'
              : status === 'warning'
                ? 'Warning: You have used over 75% of your trip budget.'
                : 'Your budget is currently in the safe zone.'
            }
          </span>
        </div>
      </div>

      {/* Remaining Budget summary */}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-semibold">
        <span className="text-slate-500">Remaining Balance</span>
        <span className="text-[#0f172a] font-extrabold text-base">
          {formatCurrency(remaining)}
        </span>
      </div>
    </div>
  );
}

