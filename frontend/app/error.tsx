"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg rounded-3xl border bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-950">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
