"use client";

import { useState, useId } from "react";
import {
  CheckIcon,
  ChevronsUpDownIcon
} from "lucide-react";

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
  selected = null,
  setSelected,
  onSearch
}) {

  const id = useId();
  const [open, setOpen] = useState(false);

  function selectItem(item) {
    setSelected(item);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>

      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >

          {selected ? (
            <span className="truncate">
              {selected.start_city?.name} → {selected.end_city?.name}
            </span>
          ) : (
            <span className="text-muted-foreground">
              Select standard description
            </span>
          )}

          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />

        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[450px] p-0">

        <Command>

          <CommandInput
            placeholder="Search descriptions..."
            onValueChange={(v) => onSearch?.(v)}
          />

          <CommandList>

            <CommandEmpty>No descriptions found</CommandEmpty>

            <CommandGroup>

              {items.map((item) => {

                const isSelected = selected?.id === item.id;

                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.start_city?.name} ${item.end_city?.name}`}
                    onSelect={() => selectItem(item)}
                  >

                    <div className="flex w-full items-start gap-2">

                      <div className="flex-1">

                        <div className="font-medium text-sm">
                          {item.start_city?.name} → {item.end_city?.name}
                        </div>

                        {item.title && (
                          <div className="text-xs text-muted-foreground">
                            {item.title}
                          </div>
                        )}

                      </div>

                      {isSelected && (
                        <CheckIcon className="h-4 w-4" />
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
  );
}
