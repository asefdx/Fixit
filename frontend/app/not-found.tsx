import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Page not found
        </h1>
        <p className="mt-4 text-base text-slate-600">
          The requested page does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
