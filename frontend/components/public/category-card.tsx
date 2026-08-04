import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/types/catalog";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Card className="group h-full border-border/60 bg-white/90 transition-transform duration-300 hover:-translate-y-1">
      <CardContent className="flex h-full flex-col justify-between p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">Category</Badge>
            <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              {category.name}
            </h3>
            {category.description ? (
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                {category.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <span>{category.isActive ? "Active" : "Inactive"}</span>
          <Link
            className="font-medium text-sky-700 hover:underline"
            href={`/services?category=${category.slug}`}
          >
            Explore services
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
