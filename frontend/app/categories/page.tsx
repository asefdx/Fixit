import { catalogService } from "@/services/catalog";

export default async function CategoriesPage() {
  const categories = await catalogService.getCategories();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
          Categories
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Browse services by category
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          From cleaning and repairs to maintenance and personal care, FixItNow
          organizes the marketplace clearly.
        </p>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-950">
              {category.name}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {category.description ?? "Curated home service category."}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
