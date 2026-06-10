import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-md bg-muted motion-safe:animate-pulse", className)}
      {...props}
    />
  );
}

export function InlineLoading({ label = "Loading", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted-foreground",
        className
      )}
      role="status"
    >
      <Loader2 className="h-4 w-4 text-primary motion-safe:animate-spin" />
      <span>{label}</span>
    </span>
  );
}

export function TableRowsSkeleton({ columns = 5, rows = 6 }) {
  return Array.from({ length: rows }).map((_, rowIndex) => (
    <TableRow key={rowIndex} className="pointer-events-none">
      {Array.from({ length: columns }).map((__, columnIndex) => (
        <TableCell key={columnIndex} className="py-4">
          <Skeleton
            className={cn(
              "h-4",
              columnIndex === 0
                ? "w-32"
                : columnIndex === columns - 1
                  ? "ml-auto w-8"
                  : "w-20"
            )}
          />
          {columnIndex === 0 && <Skeleton className="mt-2 h-3 w-20" />}
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function CardLoadingSkeleton({ variant = "default" }) {
  const hasMedia = variant === "media";
  const isCompact = variant === "compact";

  return (
    <Card
      className="overflow-hidden"
      aria-hidden="true"
    >
      {hasMedia && <Skeleton className="aspect-[16/10] rounded-none" />}

      <CardContent className={cn("space-y-4 p-5", isCompact && "space-y-3")}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>

        {!isCompact && (
          <>
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </>
        )}

        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export function StatCardsSkeleton({ count = 4, className }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} aria-hidden="true">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-12 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard">
      <StatCardsSkeleton />

      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className={index === 0 ? "lg:col-span-2" : ""}>
            <CardContent className="space-y-4 p-5">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-56" />
              {Array.from({ length: 4 }).map((__, rowIndex) => (
                <Skeleton key={rowIndex} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
