export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-primary)] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[var(--color-bg-surface)] rounded-[var(--border-radius-card)] shadow-lg border border-[var(--color-border)] p-8 text-center">
        <h1 className="text-4xl font-bold font-heading text-[var(--color-accent)] mb-4">
          GlobeTrotter
        </h1>
        <p className="text-sm font-body text-slate-600 mb-6">
          Your premium travel planning SaaS foundation. React + Vite + Tailwind CSS v4 initialized.
        </p>
        <div className="inline-block bg-[var(--color-accent)] text-white font-body px-6 py-2.5 rounded-[var(--border-radius-control)] font-semibold shadow hover:bg-[var(--color-accent-hover)] transition-all duration-200">
          Foundation Configured
        </div>
      </div>
    </div>
  )
}
