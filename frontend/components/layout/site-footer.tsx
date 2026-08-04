import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPinned,
  PhoneCall,
  Youtube,
} from "lucide-react";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/technicians", label: "Technicians" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
              FixItNow
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Reliable home services for every schedule.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            Customers book trusted technicians, technicians manage their jobs,
            and admins keep the platform running smoothly.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <p className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-cyan-200" /> Dhaka, Bangladesh
          </p>
          <p className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-cyan-200" /> +880 1000 000 001
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-cyan-200" /> support@fixitnow.dev
          </p>
          <div className="flex gap-3">
            <Link
              href="/"
              aria-label="Facebook"
              className="rounded-full border border-white/10 p-2 transition-colors hover:bg-white/10"
            >
              <Facebook className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              aria-label="Instagram"
              className="rounded-full border border-white/10 p-2 transition-colors hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              aria-label="YouTube"
              className="rounded-full border border-white/10 p-2 transition-colors hover:bg-white/10"
            >
              <Youtube className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
