import Link from "next/link";
import { ArrowUpRight, CheckCircle2, MapPin, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Technician } from "@/types/catalog";

export function TechnicianCard({ technician }: { technician: Technician }) {
  const initials = technician.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="group h-full border-border/60 bg-white/95 transition-transform duration-300 hover:-translate-y-1">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border border-border/60">
              <AvatarImage
                src={technician.avatarUrl ?? undefined}
                alt={technician.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                {technician.name}
              </h3>
              <p className="text-sm text-slate-500">{technician.email}</p>
            </div>
          </div>
          {technician.technicianProfile?.isVerified ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified
            </Badge>
          ) : (
            <Badge variant="secondary">Available</Badge>
          )}
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sky-600" />{" "}
            {technician.technicianProfile?.location ?? "Location not set"}
          </p>
          <p className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />{" "}
            {technician.averageRating?.toFixed(1) ?? "0.0"} (
            {technician.reviewCount ?? 0} reviews)
          </p>
          {technician.technicianProfile?.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {technician.technicianProfile.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <Link
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:underline"
            href={`/technicians/${technician.id}`}
          >
            View profile <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Button asChild size="sm" variant="outline">
            <Link href={`/bookings/new?technicianId=${technician.id}`}>
              Book now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
