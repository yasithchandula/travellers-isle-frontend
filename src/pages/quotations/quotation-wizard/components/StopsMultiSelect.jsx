import React, { useState } from "react";
import { Check, MapPin, MapPinned, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export default function StopsMultiSelect({
  cities = [],
  selectedIds = [],
  onChange,
  compact = false,
}) {
  const [open, setOpen] = useState(false);

  function removeStop(stopId) {
    onChange(
      (selectedIds || []).filter((id) => String(id) !== String(stopId))
    );
  }

  return (
    <div className={compact ? "" : "space-y-2"}>
      {!compact && (
        <Label className="inline-flex items-center gap-2">
          <MapPinned className="h-4 w-4 text-muted-foreground" />
          Stops
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between bg-background",
              compact && "h-9 px-2.5 font-normal"
            )}
          >
            {selectedIds?.length
              ? `${selectedIds.length} stop${selectedIds.length > 1 ? "s" : ""} selected`
              : "Select stops"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-0">
          <Command>
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div>
                <p className="text-sm font-semibold">Select stops</p>
                <p className="text-xs text-muted-foreground">
                  {selectedIds.length} selected
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={() => setOpen(false)}
                aria-label="Close stop search"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CommandInput placeholder="Search city..." />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>

              <CommandGroup>
                {cities.map((city) => {
                  const selected = selectedIds
                    ?.map(String)
                    .includes(String(city.id));

                  return (
                    <CommandItem
                      key={city.id}
                      value={city.name}
                      onSelect={() => {
                        const current = selectedIds || [];
                        const updated = selected
                          ? current.filter((id) => String(id) !== String(city.id))
                          : [...current, String(city.id)];

                        onChange(updated);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {city.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedIds?.length > 0 && (
        <div className={cn("space-y-1.5", !compact && "pt-2")}>
          {selectedIds.map((id) => {
            const city = cities.find((c) => String(c.id) === String(id));
            const cityName = city?.name || id;

            return (
              <div
                key={id}
                className="flex min-h-10 w-full items-center gap-2 rounded-lg border bg-background py-1 pl-2.5 pr-1 shadow-sm"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {cityName}
                </span>
                <button
                  type="button"
                  className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground after:absolute after:-inset-1.5 hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onClick={() => removeStop(id)}
                  aria-label={`Remove ${cityName} stop`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
