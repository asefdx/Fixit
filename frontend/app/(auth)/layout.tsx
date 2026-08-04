import Link from "next/link";
import { Sparkles, ShieldCheck, Wrench } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(241,245,249,0.96))] px-6 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/80 bg-slate-950 p-8 text-white shadow-[0_24px_120px_rgba(15,23,42,0.28)] lg:p-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-cyan-200 uppercase"
            >
              <Sparkles className="h-4 w-4" />
              FixItNow
            </Link>
            <h1 className="mt-8 max-w-xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Trusted home services, managed with role-aware workflows.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Customers book services, technicians manage jobs, and admins
              oversee the platform from a single production-grade interface.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Secure JWT",
                description: "Persistent session storage and guarded routes.",
              },
              {
                icon: Wrench,
                title: "Service flow",
                description:
                  "Bookings, payments, reviews, and dashboard actions.",
              },
              {
                icon: Sparkles,
                title: "Modern UI",
                description: "Responsive, animated, and production-ready.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <item.icon className="h-5 w-5 text-cyan-200" />
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center">
          {children}
        </section>
      </div>
    </main>
  );
}
