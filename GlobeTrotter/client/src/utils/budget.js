/**
 * Calculates the sum of all valid expenses.
 * @param {any[]} expenses 
 * @returns {number}
 */
export function getTotalExpenses(expenses) {
  if (!expenses || !Array.isArray(expenses)) return 0;
  return expenses.reduce((sum, exp) => {
    if (exp && typeof exp.amount === 'number' && !isNaN(exp.amount)) {
      return sum + exp.amount;
    }
    if (exp && typeof exp.amount === 'string') {
      const val = parseFloat(exp.amount);
      if (!isNaN(val)) return sum + val;
    }
    return sum;
  }, 0);
}

/**
 * Calculates the remaining budget (budget - spent). Returns 0 if over budget.
 * @param {any} budget 
 * @param {any[]} expenses 
 * @returns {number}
 */
export function getRemainingBudget(budget, expenses) {
  const b = parseFloat(budget);
  if (isNaN(b) || b <= 0) return 0;
  const spent = getTotalExpenses(expenses);
  const remaining = b - spent;
  return remaining > 0 ? remaining : 0;
}

/**
 * Returns the percentage of the budget used (0-100).
 * @param {any} budget 
 * @param {any[]} expenses 
 * @returns {number}
 */
export function getBudgetUsedPercentage(budget, expenses) {
  const b = parseFloat(budget);
  if (isNaN(b) || b <= 0) return 0;
  const spent = getTotalExpenses(expenses);
  const percentage = Math.round((spent / b) * 100);
  return percentage > 100 ? 100 : percentage;
}

/**
 * Groups and sums expenses by category.
 * @param {any[]} expenses 
 * @returns {Record<string, number>}
 */
export function getExpensesByCategory(expenses) {
  if (!expenses || !Array.isArray(expenses)) return {};
  return expenses.reduce((acc, exp) => {
    if (!exp) return acc;
    let category = exp.category;
    if (!category || typeof category !== 'string' || category.trim() === '') {
      category = 'Other';
    }
    
    let amount = 0;
    if (typeof exp.amount === 'number' && !isNaN(exp.amount)) {
      amount = exp.amount;
    } else if (typeof exp.amount === 'string') {
      const val = parseFloat(exp.amount);
      if (!isNaN(val)) amount = val;
    }
    
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});
}

/**
 * Returns the total amount spent in a specific category.
 * @param {any[]} expenses 
 * @param {string} category 
 * @returns {number}
 */
export function getCategoryTotal(expenses, category) {
  if (!expenses || !Array.isArray(expenses) || !category) return 0;
  return expenses.reduce((sum, exp) => {
    if (exp && exp.category === category) {
      let amount = 0;
      if (typeof exp.amount === 'number' && !isNaN(exp.amount)) {
        amount = exp.amount;
      } else if (typeof exp.amount === 'string') {
        const val = parseFloat(exp.amount);
        if (!isNaN(val)) amount = val;
      }
      return sum + amount;
    }
    return sum;
  }, 0);
}

/**
 * Returns the percentage of total expenses that belongs to a specific category.
 * @param {any[]} expenses 
 * @param {string} category 
 * @returns {number}
 */
export function getCategoryPercentage(expenses, category) {
  const total = getTotalExpenses(expenses);
  if (total <= 0) return 0;
  const catTotal = getCategoryTotal(expenses, category);
  return Math.round((catTotal / total) * 100);
}

/**
 * Returns the current budget warning level: "safe" (<75%), "warning" (75%-99%), "over" (>=100%).
 * @param {any} budget 
 * @param {any[]} expenses 
 * @returns {"safe"|"warning"|"over"}
 */
export function getBudgetStatus(budget, expenses) {
  const b = parseFloat(budget);
  const spent = getTotalExpenses(expenses);
  if (isNaN(b) || b <= 0) {
    return spent > 0 ? "over" : "safe";
  }
  const percentage = (spent / b) * 100;
  if (percentage >= 100) return "over";
  if (percentage >= 75) return "warning";
  return "safe";
}

/**
 * Computes a combined summary object of the user budget.
 * @param {any} budget 
 * @param {any[]} expenses 
 * @returns {{ budget: number, spent: number, remaining: number, percentage: number, status: "safe"|"warning"|"over" }}
 */
export function getBudgetSummary(budget, expenses) {
  const b = parseFloat(budget) || 0;
  const spent = getTotalExpenses(expenses);
  const remaining = getRemainingBudget(budget, expenses);
  const percentage = getBudgetUsedPercentage(budget, expenses);
  const status = getBudgetStatus(budget, expenses);
  return {
    budget: b,
    spent,
    remaining,
    percentage,
    status
  };
}
