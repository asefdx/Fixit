export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
          About FixItNow
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          A marketplace built for trusted home services
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          FixItNow helps customers discover verified technicians, schedule
          services, and pay securely. The platform supports customer requests,
          technician approvals, and admin oversight from one workflow.
        </p>
      </div>
    </main>
  );
}
