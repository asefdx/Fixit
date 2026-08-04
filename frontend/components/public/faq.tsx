const faqItems = [
  {
    question: "How does booking work?",
    answer:
      "Choose a service, pick a technician, select an available slot, and submit the booking request. Once the technician accepts it, you can pay through Stripe.",
  },
  {
    question: "Can I track my booking?",
    answer:
      "Yes. Customers can review each booking status from requested to completed inside the dashboard.",
  },
  {
    question: "Who can add services?",
    answer:
      "Technicians and admins can create or manage services according to their assigned permissions.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Yes. Accounts are role-based and required for booking, managing jobs, and accessing dashboards.",
  },
];

export function FAQ() {
  return (
    <div className="w-full rounded-[1.75rem] border border-border/60 bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      {faqItems.map((item, index) => (
        <details
          key={item.question}
          className="group rounded-[1.25rem] px-4 py-3 open:bg-slate-50"
        >
          <summary className="cursor-pointer list-none text-sm font-medium text-slate-950">
            {item.question}
          </summary>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
