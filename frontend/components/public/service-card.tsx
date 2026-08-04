import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Service } from "@/types/catalog";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="group h-full overflow-hidden border-border/60 bg-white/95 transition-transform duration-300 hover:-translate-y-1">
      <CardContent className="flex h-full flex-col p-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sky-100 via-white to-emerald-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_28%)]" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge>{service.isFeatured ? "Featured" : "Service"}</Badge>
            <Badge variant="outline">{service.category.name}</Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              {service.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
              {service.description}
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky-600" />{" "}
              {service.serviceLocation}
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-sky-600" />{" "}
              {service.durationMinutes
                ? `${service.durationMinutes} min`
                : "Flexible"}
            </p>
            <p className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />{" "}
              {service.averageRating.toFixed(1)} ({service.reviewCount})
            </p>
            <p className="text-lg font-semibold text-slate-950">
              ${service.price.toFixed(2)}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between pt-2">
            <Link
              className="inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:underline"
              href={`/services/${service.slug}`}
            >
              View details <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Button asChild size="sm">
              <Link href={`/bookings/new?serviceId=${service.id}`}>
                Book now
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
