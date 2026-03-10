import Link from "next/link";
import LandingThemeToggle from "@/components/landing/LandingThemeToggle";
import LandingSmokeCursor from "@/components/landing/LandingSmokeCursor";

const features = [
  {
    title: "Smart Ledger Core",
    description: "Capture every income and expense with precise category mapping.",
  },
  {
    title: "Project Intelligence",
    description: "Track budget health per project with clear visual summaries.",
  },
  {
    title: "Instant Reporting",
    description: "Generate filtered reports by date, people, project, and type.",
  },
  {
    title: "Role-Gated Access",
    description: "Keep workflows secure with admin and user level permissions.",
  },
];

const metrics = [
  { label: "Report Time Saved", value: "68%" },
  { label: "Records / Month", value: "25k+" },
  { label: "Budget Visibility", value: "100%" },
  { label: "Active Teams", value: "120+" },
];

export default function Home() {
  return (
    <main className="landing-root relative isolate min-h-screen overflow-hidden bg-[var(--landing-bg)] text-[var(--landing-text)]">
      <div className="landing-backdrop pointer-events-none absolute inset-0 -z-10" />
      <LandingSmokeCursor />

      <section
        data-native-cursor-zone
        className="landing-native-cursor sticky top-0 z-50 border-b border-[var(--landing-border)] bg-[var(--landing-surface)]/85 backdrop-blur-xl"
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-10">
          <a href="#" className="group flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--landing-brand-bg)] text-sm font-black text-[var(--landing-brand-text)] transition group-hover:scale-105">
              EF
            </span>
            <span className="text-lg font-black tracking-tight">ExpanceFlow</span>
          </a>

          <div className="order-3 flex w-full items-center gap-4 overflow-x-auto pb-1 text-sm font-medium text-[var(--landing-muted)] md:order-none md:w-auto md:pb-0">
            <a href="#features" className="whitespace-nowrap transition hover:text-[var(--landing-text)]">
              Features
            </a>
            <a href="#about" className="whitespace-nowrap transition hover:text-[var(--landing-text)]">
              About
            </a>
            <a href="#workflow" className="whitespace-nowrap transition hover:text-[var(--landing-text)]">
              Workflow
            </a>
            <a href="#contact" className="whitespace-nowrap transition hover:text-[var(--landing-text)]">
              Contact
            </a>
          </div>

          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            <LandingThemeToggle />
            <Link
              href="/login"
              className="rounded-lg border border-[var(--landing-border)] px-3 py-2 text-sm font-semibold transition hover:bg-[var(--landing-surface-2)] sm:px-4"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="landing-primary-btn rounded-lg px-3 py-2 text-sm font-bold transition hover:brightness-105 sm:px-4"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6 md:px-10 md:pt-16">
        <header className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-7">
            <p className="inline-flex rounded-full border border-[var(--landing-brand-border)] bg-[var(--landing-brand-soft)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-brand)]">
              Expense Intelligence Platform
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Control finance.
              <span className="landing-gradient-text block">Move faster.</span>
              Scale smarter.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[var(--landing-muted)] md:text-lg">
              Premium experience for finance operations with clear reports, fast
              workflows, and role-based control.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/register"
                className="landing-primary-btn rounded-xl px-6 py-3 text-center text-sm font-bold hover:brightness-105"
              >
                Start Free
              </Link>
              <Link
                href="/admin/dashboard"
                className="rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-6 py-3 text-center text-sm font-bold transition hover:bg-[var(--landing-surface-2)]"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="floating-card rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 shadow-[0_30px_80px_rgba(7,14,26,0.25)] backdrop-blur-xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--landing-muted)]">
                Live Snapshot
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/12 p-4">
                  <p className="text-xs text-[var(--landing-muted)]">Income (March)</p>
                  <p className="text-2xl font-extrabold text-emerald-500">+ $84,920</p>
                </div>
                <div className="rounded-xl border border-rose-400/40 bg-rose-500/12 p-4">
                  <p className="text-xs text-[var(--landing-muted)]">Expenses (March)</p>
                  <p className="text-2xl font-extrabold text-rose-500">- $51,140</p>
                </div>
                <div className="rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-4">
                  <p className="text-xs text-[var(--landing-muted)]">Net Balance</p>
                  <p className="text-2xl font-extrabold">$33,780</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-4 rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-3 text-sm font-semibold shadow-xl sm:-bottom-5 sm:-left-5">
              17 active projects
            </div>
          </div>
        </header>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-4 md:px-10">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 backdrop-blur-xl transition hover:-translate-y-1"
          >
            <p className="text-3xl font-black">{metric.value}</p>
            <p className="mt-2 text-sm text-[var(--landing-muted)]">{metric.label}</p>
          </article>
        ))}
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:px-10">
        <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end sm:gap-4">
          <h2 className="text-3xl font-black tracking-tight">Core Features</h2>
          <p className="text-sm text-[var(--landing-muted)]">Built for finance teams</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((item, index) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--landing-brand-soft)] text-xs font-black text-[var(--landing-brand)]">
                {index + 1}
              </div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--landing-muted)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--landing-muted)]">
            About ExpanceFlow
          </p>
          <h2 className="mb-4 text-3xl font-black tracking-tight md:text-4xl">
            A single-page financial command center for your business.
          </h2>
          <p className="max-w-4xl text-sm leading-relaxed text-[var(--landing-muted)] md:text-base">
            ExpanceFlow helps teams manage incomes, expenses, and project budgets
            from one consistent workflow with role-aware access and clear
            reporting.
          </p>
        </div>
      </section>

      <section
        id="workflow"
        className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 md:px-10"
      >
        {["Record", "Monitor", "Decide"].map((step, i) => (
          <article
            key={step}
            className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-muted)]">
              Step {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mb-2 text-xl font-bold">{step}</h3>
            <p className="text-sm text-[var(--landing-muted)]">
              {step === "Record" &&
                "Add entries with project, person, category, and date in one form."}
              {step === "Monitor" &&
                "Watch budget movement through dashboards designed for quick review."}
              {step === "Decide" &&
                "Export and discuss reports with the team to act on data, not guess."}
            </p>
          </article>
        ))}
      </section>

      <section id="contact" className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 sm:p-8">
          <h2 className="mb-5 text-3xl font-black tracking-tight sm:max-w-xl">
            Ready To Level Up Your Finance Ops?
          </h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/login"
              className="landing-primary-btn rounded-xl px-5 py-3 text-center text-sm font-bold"
            >
              Go to Login
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] px-5 py-3 text-center text-sm font-bold"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
      <footer className="border-t border-[var(--landing-border)] px-4 py-6 text-center text-sm text-[var(--landing-muted)] sm:px-6 md:px-10">
        ExpanceFlow * Built for smarter business finance operations
      </footer>
    </main>
  );
}
