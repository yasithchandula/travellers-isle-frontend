"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  SearchIcon,
  XIcon,
  ImageIcon,
  Sparkles,
  BadgeInfo,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { buildImageUrl } from "@/utils/urls";

/* =========================
   HELPERS
========================= */
function groupByPricing(items) {
  const order = ["PER_PERSON", "BOAT", "SAFARI", "CUSTOM", "FREE", "OTHER"];
  const groups = {};

  items.forEach((item) => {
    const key = item?.pricing_type || "OTHER";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return order
    .filter((key) => groups[key]?.length)
    .reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {});
}

function getPrimaryPrice(item) {
  switch (item?.pricing_type) {
    case "BOAT":
      return Number(item?.boat_price || 0);
    case "SAFARI":
      return Number(item?.jeep_rent_price || 0);
    case "CUSTOM":
      return Number(item?.optional_supplement_price || 0);
    case "FREE":
      return 0;
    case "PER_PERSON":
    default:
      return Number(item?.adult_price || 0);
  }
}

function formatCurrency(value, currency = "USD") {
  const amount = Number(value || 0);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function pricingLabel(type) {
  switch (type) {
    case "PER_PERSON":
      return "Per Person";
    case "BOAT":
      return "Boat";
    case "SAFARI":
      return "Safari";
    case "CUSTOM":
      return "Custom";
    case "FREE":
      return "Free";
    default:
      return "Other";
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderHighlightedText(text, query) {
  if (!text) return null;
  if (!query?.trim()) return text;

  const safeQuery = escapeRegex(query.trim());
  const regex = new RegExp(`(${safeQuery})`, "ig");
  const parts = String(text).split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-yellow-200 px-0.5 text-current"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}

function ImageThumb({ item }) {
  const image = item?.gallery?.[0];

  if (!image) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={buildImageUrl(image)}
      alt={item?.name || "Excursion"}
      className="h-12 w-12 shrink-0 rounded-lg border object-cover"
      loading="lazy"
    />
  );
}

export default function ExcursionSelector({
  items = [],
  selected = [],
  setSelected,
  onSearch,
}) {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* =========================
     DEBOUNCED SEARCH
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, onSearch]);

  /* =========================
     FAST LOOKUPS
  ========================= */
  const selectedMap = useMemo(() => {
    const map = new Map();
    selected.forEach((item) => {
      map.set(String(item.id), item);
    });
    return map;
  }, [selected]);

  /* =========================
     LOCAL FILTER
  ========================= */
  const filteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) => {
      const haystack = [
        item?.name,
        item?.title,
        item?.description,
        item?.pricing_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, searchText]);

  const groupedItems = useMemo(
    () => groupByPricing(filteredItems),
    [filteredItems]
  );

  /* =========================
     SELECT / REMOVE / OPTIONAL
  ========================= */
  function toggleSelection(item) {
    const key = String(item.id);
    const exists = selectedMap.has(key);

    if (exists) {
      setSelected((prev) => prev.filter((entry) => String(entry.id) !== key));
      return;
    }

    setSelected((prev) => [
      ...prev,
      {
        ...item,
        is_optional: false,
      },
    ]);
  }

  function removeSelection(itemId) {
    const key = String(itemId);
    setSelected((prev) => prev.filter((entry) => String(entry.id) !== key));
  }

  function toggleOptional(itemId, checked) {
    const key = String(itemId);
    setSelected((prev) =>
      prev.map((entry) =>
        String(entry.id) === key
          ? { ...entry, is_optional: checked === true }
          : entry
      )
    );
  }

  /* =========================
     SELECTED BADGES
  ========================= */
  const maxShown = 4;
  const visibleSelections = expanded ? selected : selected.slice(0, maxShown);
  const hiddenCount = selected.length - visibleSelections.length;

  return (
    <div className="w-full space-y-3 z-[9999]">
      <Popover open={open} onOpenChange={setOpen} className="z-[9999]">
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-h-11 w-full justify-between rounded-xl px-3 py-2"
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 pr-3 text-left">
              {selected.length > 0 ? (
                <>
                  {visibleSelections.map((item) => (
                    <Badge
                      key={item.id}
                      variant="secondary"
                      className="flex max-w-full items-center gap-1 rounded-lg px-2 py-1"
                    >
                      <span className="max-w-[180px] truncate">
                        {item.name || item.title}
                      </span>

                      {item.is_optional && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                          Optional
                        </span>
                      )}

                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelection(item.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            removeSelection(item.id);
                          }
                        }}
                        className="cursor-pointer rounded p-0.5 hover:bg-background"
                        aria-label={`Remove ${item.name || item.title}`}
                      >
                        <XIcon className="h-3 w-3" />
                      </span>
                    </Badge>
                  ))}

                  {(hiddenCount > 0 || expanded) && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded((prev) => !prev);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          setExpanded((prev) => !prev);
                        }
                      }}
                      className="inline-flex items-center rounded-lg border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                    >
                      {expanded ? "Show less" : `+${hiddenCount} more`}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Select excursions
                </span>
              )}
            </div>

            <ChevronsUpDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[520px] overflow-hidden rounded-2xl p-0 shadow-2xl"
        >
          <div className="flex h-[460px] flex-col bg-background">
            {/* Header */}
            <div className="shrink-0 border-b bg-background/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Choose excursions</p>
                  <p className="text-xs text-muted-foreground">
                    Link activities and mark optional ones.
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/30 px-2 py-1 text-[11px] text-muted-foreground">
                  {selected.length} selected
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 shadow-sm">
                <SearchIcon className="h-4 w-4 text-muted-foreground" />
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by name, description, pricing type..."
                  className="h-6 w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-hidden">
              <Command shouldFilter={false} className="h-full">
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  <CommandList className="min-h-full px-2 py-2">
                    <CommandEmpty className="py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-2xl bg-muted p-3">
                          <BadgeInfo className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">No excursions found</p>
                          <p className="text-xs text-muted-foreground">
                            Try a different keyword.
                          </p>
                        </div>
                      </div>
                    </CommandEmpty>

                    {Object.entries(groupedItems).map(([group, list]) => (
                      <CommandGroup
                        key={group}
                        heading={pricingLabel(group)}
                        className="mb-3 overflow-visible rounded-xl border bg-muted/10 p-2"
                      >
                        <div className="space-y-2">
                          {list.map((item) => {
                            const selectedItem = selectedMap.get(String(item.id));
                            const isSelected = !!selectedItem;
                            const basePrice = getPrimaryPrice(item);

                            return (
                              <CommandItem
                                key={item.id}
                                value={`${item.id} ${item.name || ""} ${item.description || ""} ${item.pricing_type || ""}`}
                                onSelect={() => toggleSelection(item)}
                                className="group flex items-start gap-3 rounded-xl border bg-background p-3 shadow-sm transition hover:border-primary/30 hover:bg-muted/20 data-[selected=true]:bg-muted/20"
                              >
                                <div
                                  className="pt-0.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => toggleSelection(item)}
                                    aria-label={`Select ${item.name || item.title}`}
                                  />
                                </div>

                                <ImageThumb item={item} />

                                <div className="min-w-0 flex-1 space-y-2">
                                  <div className="flex items-start gap-2">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-semibold">
                                          {renderHighlightedText(
                                            item.name || item.title || "Untitled",
                                            searchText
                                          )}
                                        </p>

                                        {isSelected && (
                                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                            <CheckIcon className="mr-1 h-3 w-3" />
                                            Selected
                                          </span>
                                        )}
                                      </div>

                                      {!!item.description && (
                                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                          {renderHighlightedText(
                                            item.description,
                                            searchText
                                          )}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-1.5">
                                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                                      {pricingLabel(item.pricing_type)}
                                    </span>

                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                      {item.is_full_day ? "Full Day" : "Half Day"}
                                    </span>

                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                      {formatCurrency(
                                        basePrice,
                                        item.currency || "USD"
                                      )}
                                    </span>

                                    {item.allow_zero_at_quotation ? (
                                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                                        Zero Allowed
                                      </span>
                                    ) : null}
                                  </div>

                                  {isSelected && (
                                    <div
                                      className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                                        <span className="text-xs font-medium text-emerald-800">
                                          Mark as optional
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={!!selectedItem?.is_optional}
                                          onCheckedChange={(checked) =>
                                            toggleOptional(item.id, checked)
                                          }
                                          aria-label={`Optional ${item.name || item.title}`}
                                        />
                                        <span className="text-xs text-emerald-800">
                                          Optional in quotation
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CommandItem>
                            );
                          })}
                        </div>
                      </CommandGroup>
                    ))}
                  </CommandList>
                </div>
              </Command>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t bg-muted/10 px-3 py-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {filteredItems.length} result{filteredItems.length === 1 ? "" : "s"}
                </span>
                <span>
                  {selected.length} selected
                </span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}