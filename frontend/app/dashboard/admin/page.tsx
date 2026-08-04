"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/providers/auth-provider";

export default function AdminDashboardPage() {
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
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-700">
          Admin dashboard
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Platform control center for {user?.name ?? "admin"}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Monitor users, categories, services, bookings, and payment health from
          one command center.
        </p>
      </div>
    </main>
  );
}
