import Link from "next/link";

import { catalogService } from "@/services/catalog";

export const dynamic = "force-dynamic";

export default async function TechniciansPage() {
  let technicians: { technicians: Array<unknown>; meta: unknown } = {
    technicians: [],
    meta: null,
  };

  try {
    technicians = await catalogService.getTechnicians({ limit: 6 });
  } catch {
    technicians = { technicians: [], meta: null };
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
          Technicians
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Meet verified professionals available right now
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Every technician profile displays experience, ratings, skills, and
          location so customers can choose confidently.
        </p>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {technicians.technicians.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 md:col-span-2 xl:col-span-3">
            Technicians are temporarily unavailable. Please try again shortly.
          </div>
        ) : (
          technicians.technicians.map((technician: any) => (
            <article
              key={technician.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    {technician.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {technician.technicianProfile?.location ??
                      "Location available soon"}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  {technician.averageRating ?? 0}/5
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {technician.technicianProfile?.bio ??
                  "Professional service provider ready to help."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {technician.technicianProfile?.skills
                  .slice(0, 4)
                  .map((skill: string) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {technician._count?.services ?? 0} services
                </span>
                <Link
                  href={`/technicians/${technician.id}`}
                  className="text-sm font-semibold text-sky-700"
                >
                  View profile
                </Link>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
