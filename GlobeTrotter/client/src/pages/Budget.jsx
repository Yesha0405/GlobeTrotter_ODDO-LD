import { useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { formatDate } from '../utils/date';
import { 
  getBudgetSummary, 
  getExpensesByCategory, 
  getCategoryPercentage, 
  getCategoryTotal 
} from '../utils/budget';
import BudgetCard from '../components/BudgetCard';
import { 
  ArrowLeft, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  DollarSign, 
  Wallet, 
  Tag, 
  FileText 
} from 'lucide-react';

export default function Budget() {
  const { tripId } = useParams();
  const { trips, addExpenseToTrip, deleteExpenseFromTrip } = useTrip();

  // Find the trip
  const trip = useMemo(() => {
    return trips.find(t => t.id === tripId) || null;
  }, [trips, tripId]);

  // Form scroll reference
  const formRef = useRef(null);

  // Form State for Expense creation
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Food',
    amount: '',
    date: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  // Budget summary numbers
  const budgetSummary = useMemo(() => {
    if (!trip) return null;
    if (trip.budgetData) {
      const budget = Number(trip.budget || 0);
      const spent = Number(trip.budgetData.spent || 0);
      const remaining = Number(trip.budgetData.remaining || 0);
      const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;
      const status = spent >= budget ? "over" : spent >= budget * 0.75 ? "warning" : "safe";
      return {
        budget,
        spent,
        remaining,
        percentage: percentage > 100 ? 100 : percentage,
        status
      };
    }
    return getBudgetSummary(trip.budget || 0, trip.expenses || []);
  }, [trip]);

  // Category breakdown list
  const categoryTotals = useMemo(() => {
    if (!trip) return {};
    return getExpensesByCategory(trip.expenses || []);
  }, [trip]);

  if (!trip) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center font-body space-y-4">
        <AlertCircle className="w-12 h-12 text-[#dc2626] mx-auto" />
        <h2 className="text-2xl font-bold font-heading text-[#0f172a]">Trip Not Found</h2>
        <p className="text-slate-500">We couldn't locate the travel budget details you requested.</p>
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

  // Smooth scroll to form focus
  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Focus first input
    setTimeout(() => {
      document.getElementById('expense-title')?.focus();
    }, 400);
  };

  // Input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const tempErrors = {};
    if (!expenseForm.title.trim()) {
      tempErrors.title = 'Expense name is required.';
    }
    if (!expenseForm.amount || isNaN(parseFloat(expenseForm.amount)) || parseFloat(expenseForm.amount) <= 0) {
      tempErrors.amount = 'Amount must be a positive number.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit Expense
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    try {
      addExpenseToTrip(trip.id, {
        title: expenseForm.title.trim(),
        category: expenseForm.category,
        amount: parseFloat(expenseForm.amount),
        date: expenseForm.date || new Date().toISOString().split('T')[0]
      });

      // Reset form
      setExpenseForm({
        title: '',
        category: 'Food',
        amount: '',
        date: ''
      });
    } catch (err) {
      setSubmitError('Failed to record this expense. Please check your data.');
      console.error(err);
    }
  };

  // Delete Expense callback
  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      deleteExpenseFromTrip(trip.id, expenseId);
    }
  };

const categories = [
  "Accommodation",
  "Food",
  "Transport",
  "Activities",
  "Other"
];
  const categoryIcons = {
    Lodging: Wallet,
    Food: DollarSign,
    Transport: ArrowLeft,
    Activities: Plus,
    Miscellaneous: Tag
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-body">
      
      {/* ==================================================
          PAGE HEADER
          ================================================== */}
      <header className="space-y-4">
        <Link 
          to={`/itinerary/${trip.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0d9488] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Itinerary</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold font-heading text-[#0f172a]">Expense Management</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#0d9488]" />
                {trip.destination}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </span>
            </div>
          </div>

          <button
            onClick={handleScrollToForm}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-[10px] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </header>

      {/* ==================================================
          SUMMARY METRICS ROW
          ================================================== */}
      <section>
        {trip.budget > 0 ? (
          <div className="max-w-xl">
            <BudgetCard 
              budget={budgetSummary.budget}
              spent={budgetSummary.spent}
              remaining={budgetSummary.remaining}
              percentage={budgetSummary.percentage}
              status={budgetSummary.status}
              currency={trip.currency || 'USD'}
            />
          </div>
        ) : (
          /* No-Budget State Banner */
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-3xl">
            <div className="space-y-1 flex-grow">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">No Budget Set</span>
              <h3 className="text-lg font-bold text-[#0f172a] font-heading">Accumulated Expenses Tracker</h3>
              <p className="text-sm text-slate-500">
                You currently do not have a budget limit configured for this trip, but you can still record expenses below.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 min-w-[180px] text-center">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total Spending</span>
                <span className="text-xl font-extrabold text-[#0f172a]">
                  {trip.currency || 'USD'} {budgetSummary?.spent.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==================================================
          MAIN LAYOUT: CATEGORIES/FORM & TRANSACTION LIST
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: CATEGORIES & ADD EXPENSE FORM */}
        <section className="space-y-6 lg:col-span-1">
          
          {/* Category breakdown analysis */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
              Category Analysis
            </h3>
            
            {Object.keys(categoryTotals).length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 text-center">
                Record expenses to view category breakdowns.
              </p>
            ) : (
              <div className="space-y-4">
                {categories.map(cat => {
                  const catAmt = getCategoryTotal(trip.expenses || [], cat);
                  if (catAmt <= 0) return null;
                  const catPct = getCategoryPercentage(trip.expenses || [], cat);
                  
                  return (
                    <div key={cat} className="space-y-1.5 text-xs text-[#0f172a]">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-slate-600 capitalize">{cat}</span>
                        <span>
                          {trip.currency || 'USD'} {catAmt.toLocaleString()} ({catPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-[#0d9488] rounded-full" 
                          style={{ width: `${catPct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Expense Form Card */}
          <div 
            ref={formRef} 
            className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-24"
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
              Add Expense Record
            </h3>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 text-xs text-[#dc2626] font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Expense Title */}
              <div className="space-y-1">
                <label htmlFor="expense-title" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Expense Details
                </label>
                <input
                  type="text"
                  id="expense-title"
                  name="title"
                  value={expenseForm.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Flight CDG292, Dinner"
                  className={`w-full px-4 py-2 bg-white border rounded-[10px] text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                    errors.title ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                  }`}
                />
                {errors.title && (
                  <p className="text-[10px] text-[#dc2626] font-semibold">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <div className="space-y-1">
                <label htmlFor="expense-amount" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Amount ({trip.currency || 'USD'})
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    id="expense-amount"
                    name="amount"
                    value={expenseForm.amount}
                    onChange={handleInputChange}
                    placeholder="e.g. 45"
                    min="0.01"
                    step="any"
                      className={`w-full pl-8 pr-3 py-2 bg-white border rounded-[10px] text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all ${
                        errors.amount ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e2e8f0] focus:border-[#0d9488]'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-[10px] text-[#dc2626] font-semibold">{errors.amount}</p>
                  )}
                </div>

                {/* Category selection */}
                <div className="space-y-1">
                  <label htmlFor="expense-category" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Category
                  </label>
                  <div className="relative font-body">
                    <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <select
                      id="expense-category"
                      name="category"
                      value={expenseForm.category}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-[#e2e8f0] focus:border-[#0d9488] rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Expense Date */}
              <div className="space-y-1">
                <label htmlFor="expense-date" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Expense Date
                </label>
                <input
                  type="date"
                  id="expense-date"
                  name="date"
                  value={expenseForm.date}
                  onChange={handleInputChange}
                  min={trip.startDate}
                  max={trip.endDate}
                  className="w-full px-4 py-2 bg-white border border-[#e2e8f0] focus:border-[#0d9488] rounded-[10px] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-[10px] shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Expense</span>
              </button>
            </form>
          </div>

        </section>

        {/* RIGHT COLUMN: EXPENSES HISTORY LIST */}
        <section className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-[#e2e8f0] pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0d9488]" />
            Expense History Log
          </h3>

          {!trip.expenses || trip.expenses.length === 0 ? (
            /* Empty state for expenses log */
            <div className="py-16 text-center space-y-3">
              <Wallet className="w-12 h-12 text-slate-200 mx-auto" />
              <h4 className="text-base font-bold text-[#0f172a] font-heading">No expenses logged yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Log transactions for transportation, meals, or sightseeing tickets to stay on top of budget allocations.
              </p>
            </div>
          ) : (
            /* Listing entries table/list */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-body border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-2">Expense</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2 text-right">Amount</th>
                    <th className="py-3 px-2 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]/60">
                  {[...trip.expenses]
                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Latest first
                    .map(exp => (
                      <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-2 font-semibold text-[#0f172a]">
                          {exp.title}
                        </td>
                        <td className="py-3.5 px-2">
                          <span className="inline-block text-xs font-semibold px-2 py-0.5 border border-slate-200 bg-slate-50 text-slate-600 rounded-[10px] capitalize">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-xs text-slate-500">
                          {formatDate(exp.date)}
                        </td>
                        <td className="py-3.5 px-2 text-right font-bold text-[#0f172a]">
                          {trip.currency || 'USD'} {parseFloat(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-2 text-center">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1 text-slate-400 hover:text-[#dc2626] hover:bg-slate-50 rounded-[6px] transition-colors"
                            aria-label="Delete expense"
                            title="Delete expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>

    </main>
  );
}
