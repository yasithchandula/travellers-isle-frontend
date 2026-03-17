import { Card, CardContent } from "@/components/ui/card";

export default function CardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border bg-background/60">
      <div className="aspect-[16/10] animate-pulse bg-muted" />

      <CardContent className="space-y-4 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />

        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="h-9 w-full animate-pulse rounded-xl bg-muted" />
      </CardContent>
    </Card>
  );
}