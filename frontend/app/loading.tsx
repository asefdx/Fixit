export default function LoadingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
        <p className="text-sm font-medium text-slate-600">
          Loading FixItNow...
        </p>
      </div>
    </main>
  );
}
