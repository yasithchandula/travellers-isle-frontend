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

export default function StandardDescriptionSelector({
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
                      {item.start_city?.name} → {item.end_city?.name}

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
                  Select standard descriptions
                </span>
              )}

            </div>

            <ChevronsUpDownIcon className="text-muted-foreground shrink-0" />

          </Button>
        </PopoverTrigger>


        <PopoverContent className="w-[420px] p-0">

          <Command>

            <CommandInput
              placeholder="Search standard descriptions..."
              onValueChange={(v) => onSearch?.(v)}
            />

            <CommandList>

              <CommandEmpty>No descriptions found</CommandEmpty>

              <CommandGroup>

                {items.map((item) => {

                  const isSelected = selected.find(
                    (s) => s.id === item.id
                  );

                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.start_city?.name} ${item.end_city?.name} ${item.title}`}
                      onSelect={() => toggleSelection(item)}
                      className="flex gap-3 items-start"
                    >

                      <div className="flex-1">

                        <div className="flex items-center gap-2">

                          <span className="font-medium text-sm">
                            {item.start_city?.name} → {item.end_city?.name}
                          </span>

                          {isSelected && (
                            <CheckIcon
                              size={16}
                              className="ml-auto"
                            />
                          )}

                        </div>

                        {item.title && (
                          <div className="text-xs text-muted-foreground">
                            {item.title}
                          </div>
                        )}

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