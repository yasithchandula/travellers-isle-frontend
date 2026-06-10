import { CardLoadingSkeleton } from "@/components/common/LoadingStates";

export default function CardGrid({
  children,
  loading = false,
  skeletonCount = 6,
  skeletonVariant = "default",
}) {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy={loading}
    >
      {loading
        ? Array.from({ length: skeletonCount }).map((_, index) => (
            <CardLoadingSkeleton key={index} variant={skeletonVariant} />
          ))
        : children}
    </div>
  );
}
