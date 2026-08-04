import Link from "next/link";

import { catalogService } from "@/services/catalog";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  let services;

  try {
    services = await catalogService.getServices({ limit: 6 });
  } catch {
    services = { services: [] as Array<unknown>, meta: null };
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
            Services
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Explore trusted home services
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Browse featured services, compare prices, and book instantly from a
            single marketplace.
          </p>
        </div>
        <Link
          href="/technicians"
          className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-500 hover:text-sky-700"
        >
          Meet technicians
        </Link>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.services.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 md:col-span-2 xl:col-span-3">
            Services are temporarily unavailable. Please try again shortly.
          </div>
        ) : (
          services.services.map((service: any) => (
            <article
              key={service.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
                  {service.category.name}
                </span>
                <span className="text-sm font-semibold text-emerald-600">
                  ${service.price}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">
                {service.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {service.description}
              </p>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                <span>{service.serviceLocation}</span>
                <span>{service.reviewCount} reviews</span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {service.technician?.name ?? "Verified technician"}
                </span>
                <Link
                  href={`/services/${service.id}`}
                  className="text-sm font-semibold text-sky-700"
                >
                  View details
                </Link>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
