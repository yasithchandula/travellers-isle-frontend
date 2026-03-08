"use client";

import { useMemo } from "react";
import { Search, Check, Trash2 } from "lucide-react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

import {
  Card,
  CardContent
} from "@/components/ui/card";

export default function StandardDescriptionSelector({
  items = [],
  selected = [],
  setSelected,
  onSearch,
}) {

  function addItem(item) {
    if (selected.find((x) => x.id === item.id)) return;
    setSelected([...selected, item]);
  }

  function removeItem(id) {
    setSelected(selected.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-3">

      {/* SEARCH */}

      <InputGroup>
        <InputGroupInput
          placeholder="Search standard descriptions..."
          onChange={(e) => onSearch(e.target.value)}
        />
        <InputGroupAddon>
          <Search size={16} />
        </InputGroupAddon>
      </InputGroup>


      {/* LIST */}

      <div className="max-h-[200px] overflow-auto border rounded-md">

        {items.map((d) => {

          const exists = selected.find((x) => x.id === d.id);

          return (
            <div
              key={d.id}
              onClick={() => addItem(d)}
              className={`p-2 cursor-pointer flex justify-between items-center hover:bg-gray-50 ${
                exists ? "bg-green-50" : ""
              }`}
            >

              <div className="text-sm">
                <div className="font-medium">
                  {d.start_city?.name} → {d.end_city?.name}
                </div>

                {d.title && (
                  <div className="text-xs text-gray-500">
                    {d.title}
                  </div>
                )}
              </div>

              {exists && (
                <Check size={16} className="text-green-600" />
              )}

            </div>
          );
        })}

      </div>


      {/* SELECTED */}

      {selected.length > 0 && (

        <Card>
          <CardContent className="p-3 space-y-2">

            {selected.map((d) => (

              <div
                key={d.id}
                className="flex justify-between items-center text-sm border rounded px-2 py-1"
              >

                <div>
                  {d.start_city?.name} → {d.end_city?.name}
                </div>

                <button
                  onClick={() => removeItem(d.id)}
                  className="text-red-500"
                >
                  <Trash2 size={14} />
                </button>

              </div>

            ))}

          </CardContent>
        </Card>

      )}

    </div>
  );
}