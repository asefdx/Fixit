"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/providers/auth-provider";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
          Customer dashboard
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Welcome back, {user?.name ?? "customer"}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Manage bookings, track job status, and continue to a secure payment
          step once your technician accepts the request.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">Bookings</h2>
            <p className="mt-2 text-sm text-slate-600">
              Track accepted, in-progress, and completed services.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">Payments</h2>
            <p className="mt-2 text-sm text-slate-600">
              Complete payment after booking acceptance.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-950">Reviews</h2>
            <p className="mt-2 text-sm text-slate-600">
              Share feedback after each completed service.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/services"
            className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Browse services
          </Link>
          <Link
            href="/technicians"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-500 hover:text-sky-700"
          >
            View technicians
          </Link>
        </div>
      </div>
    </main>
  );
}
