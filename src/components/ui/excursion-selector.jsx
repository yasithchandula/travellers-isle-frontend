"use client";

import { useState, useId } from "react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  XIcon
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { buildImageUrl } from "@/utils/urls";

export default function ExcursionSelector({
  items = [],
  selected = [],
  setSelected,
  onSearch
}) {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  function toggleSelection(item) {
    const exists = selected.find((s) => s.id === item.id);

    if (exists) {
      setSelected(selected.filter((s) => s.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  }

  function removeSelection(id) {
    setSelected(selected.filter((s) => s.id !== id));
  }

  const maxShown = 3;
  const visible = expanded ? selected : selected.slice(0, maxShown);
  const hiddenCount = selected.length - visible.length;

  return (
    <div className="w-full space-y-2">

      <Popover open={open} onOpenChange={setOpen}>

        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-9 w-full justify-between"
          >

            <div className="flex flex-wrap items-center gap-1 pr-2">

              {selected.length > 0 ? (
                <>
                  {visible.map((item) => (
                    <Badge
                      key={item.id}
                      variant="outline"
                      className="flex items-center gap-1 rounded-sm"
                    >
                      {item.name}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelection(item.id);
                        }}
                        asChild
                      >
                        <span>
                          <XIcon className="size-3" />
                        </span>
                      </Button>
                    </Badge>
                  ))}

                  {(hiddenCount > 0 || expanded) && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer rounded-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded((p) => !p);
                      }}
                    >
                      {expanded ? "Show Less" : `+${hiddenCount} more`}
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">
                  Select excursions
                </span>
              )}

            </div>

            <ChevronsUpDownIcon className="text-muted-foreground shrink-0" />

          </Button>
        </PopoverTrigger>


        <PopoverContent className="w-[420px] p-0">

          <Command>

            <CommandInput
              placeholder="Search excursions..."
              onValueChange={(v) => onSearch?.(v)}
            />

            <CommandList>

              <CommandEmpty>No excursions found</CommandEmpty>

              <CommandGroup>

                {items.map((item) => {

                  const isSelected = selected.find(
                    (s) => s.id === item.id
                  );

                  return (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => toggleSelection(item)}
                      className="flex gap-3 items-start"
                    >

                      {/* Thumbnail */}

                      {item.gallery?.[0] && (
                        <img
                          src={buildImageUrl(item.gallery[0])}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}

                      {/* Content */}

                      <div className="flex-1">

                        <div className="flex items-center gap-2">

                          <span className="font-medium text-sm">
                            {item.name}
                          </span>

                          {isSelected && (
                            <CheckIcon
                              size={16}
                              className="ml-auto"
                            />
                          )}

                        </div>

                        {item.description && (
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </div>
                        )}

                        <div className="flex gap-1 pt-1 text-[10px]">

                          {item.pricing_type && (
                            <span className="px-2 py-0.5 rounded bg-ti-sky/30">
                              {item.pricing_type}
                            </span>
                          )}

                          {item.is_full_day !== undefined && (
                            <span className="px-2 py-0.5 rounded bg-ti-mint/40">
                              {item.is_full_day ? "Full Day" : "Half Day"}
                            </span>
                          )}

                          {item.allow_zero_at_quotation && (
                            <span className="px-2 py-0.5 rounded bg-yellow-200">
                              Zero Allowed
                            </span>
                          )}

                        </div>

                      </div>

                    </CommandItem>
                  );
                })}

              </CommandGroup>

            </CommandList>

          </Command>

        </PopoverContent>

      </Popover>

    </div>
  );
}