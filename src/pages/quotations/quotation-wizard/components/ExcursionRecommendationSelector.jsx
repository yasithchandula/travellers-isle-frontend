import { Loader2, MapPinned, Sparkles } from "lucide-react";

import ExcursionSelector from "@/components/ui/excursion-selector";

export default function ExcursionRecommendationSelector({
  items = [],
  recommended = [],
  selected = [],
  loading = false,
  error = null,
  stopCount = 0,
  cities = [],
  setSelected,
  onSearch,
}) {
  const mergedItems = mergeById(recommended, items);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg border bg-background px-2.5 py-2">
        {loading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
        ) : recommended.length ? (
          <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
        ) : (
          <MapPinned className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold">
            {error
              ? "Excursion recommendations unavailable"
              : loading
              ? "Finding stop-based excursions"
              : recommended.length
                ? `${recommended.length} excursion${
                    recommended.length === 1 ? "" : "s"
                  } recommended`
                : stopCount
                  ? "No excursions found for selected stops"
                  : "Add stops for excursion recommendations"}
          </div>
          <div className="truncate text-[11px] text-muted-foreground">
            {error
              ? String(error)
              : "Search all excursions below to add more manually."}
          </div>
        </div>
      </div>

      <ExcursionSelector
        compact
        showSelectedDetails
        items={mergedItems}
        selected={selected}
        cities={cities}
        setSelected={setSelected}
        onSearch={onSearch}
        recommendedIds={recommended.map((item) => item.id)}
      />
    </div>
  );
}

function mergeById(primary, secondary) {
  const items = new Map();

  [...primary, ...secondary].forEach((item) => {
    const id = item?.id ?? item?.excursion_id;
    if (!id) return;
    items.set(String(id), { ...item, id });
  });

  return Array.from(items.values());
}
