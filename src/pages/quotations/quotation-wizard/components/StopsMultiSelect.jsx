import React from "react";
import { Check, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
  return (
    <div className={compact ? "" : "space-y-2"}>
      {!compact && (
        <Label className="inline-flex items-center gap-2">
          <MapPinned className="h-4 w-4 text-muted-foreground" />
          Stops
        </Label>
      )}

      <Popover>
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

      {!compact && selectedIds?.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedIds.map((id) => {
            const city = cities.find((c) => String(c.id) === String(id));

            return (
              <Badge key={id} variant="secondary">
                {city?.name || id}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
