import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Wrench } from "lucide-react";

import { PublicShell } from "@/components/layout/public-shell";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Secure booking flow",
    description:
      "Role-aware access for customers, technicians, and admins with trusted authentication.",
  },
  {
    icon: Wrench,
    title: "End-to-end service management",
    description:
      "Manage bookings from request to completion and collect payment after acceptance.",
  },
  {
    icon: Sparkles,
    title: "Modern marketplace UI",
    description:
      "Beautiful landing pages, rich service discovery, and a polished dashboard experience.",
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      <main className="bg-white">
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
              Trusted home services marketplace
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Book dependable home services in minutes.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              FixItNow connects customers with verified technicians for repairs,
              cleaning, maintenance, and more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Explore services
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <item.icon className="h-5 w-5 text-sky-700" />
                <h2 className="mt-4 text-base font-semibold text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Built for assignment 5
            </p>
            <p className="mt-3 text-lg text-slate-700">
              Customers discover services, technicians manage bookings, and
              admins oversee the platform from one simple experience.
            </p>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
