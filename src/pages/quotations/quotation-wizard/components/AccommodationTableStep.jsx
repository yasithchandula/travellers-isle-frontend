import React, { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Button } from "../../../../components/ui/button";
import {
  Copy,
  Save,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import { toast } from "sonner"; // ✅ ADDED

import { fetchHotels } from "../../../../app/slices/hotelSlice";
import {
  bulkSaveQuotationOptions,
  fetchQuotationOptions,
  updateQuotationOption,
  deleteQuotationOption,
} from "../../../../app/slices/quotationSlice";

import AccommodationCell from "./AccommodationCell";

export default function AccommodationTableStep({
  days = [],
  cities = [],
  quotationShell,
  onUpdateDay,
}) {
  const dispatch = useDispatch();

  const [globalOptions, setGlobalOptions] = useState([
    { option_name: "Option 1", option_index: 0 },
  ]);

  const [collapsedOptions, setCollapsedOptions] = useState({});
  const [initialized, setInitialized] = useState(false);

  const [editingOption, setEditingOption] = useState(null);
  const [tempName, setTempName] = useState("");

  const { items: hotels } = useSelector((state) => state.hotels);
  const { options: apiOptions } = useSelector((state) => state.quotations);

  /** ========================= */
  const toggleCollapse = (index) => {
    setCollapsedOptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  /** ========================= */
  const handleRename = async (opt) => {
    if (!quotationShell?.id) return;

    const promise = dispatch(
      updateQuotationOption({
        quotationId: quotationShell.id,
        optionIndex: opt.option_index,
        payload: { option_name: tempName },
      })
    );

    toast.promise(promise, {
      loading: "Renaming option...",
      success: "Option renamed successfully",
      error: "Failed to rename option",
    });

    await promise;

    setEditingOption(null);
    dispatch(fetchQuotationOptions(quotationShell.id));
  };

  /** ========================= */
  const handleDelete = async (opt) => {
    if (!quotationShell?.id) return;

    const promise = dispatch(
      deleteQuotationOption({
        quotationId: quotationShell.id,
        optionIndex: opt.option_index,
      })
    );

    toast.promise(promise, {
      loading: "Deleting option...",
      success: "Option deleted",
      error: "Delete failed",
    });

    await promise;

    dispatch(fetchQuotationOptions(quotationShell.id));
  };

  /** ========================= */
  useEffect(() => {
    if (initialized) return;
    if (!apiOptions?.length || !days?.length || !hotels.length) return;

    const updatedDays = days.map((day) => {
      const accommodation = [];

      apiOptions.forEach((opt) => {
        const foundDay = opt.days?.find(
          (d) =>
            Number(d.itinerary_day_id) === Number(day.id)
        );

        if (!foundDay) return;

        accommodation[opt.option_index] = {
          option_name: opt.option_name,
          option_index: opt.option_index,
          itinerary_day_id: day.id,
          hotel_id: foundDay.hotel_id || null,
          hotel_name_override:
            foundDay.hotel_name_override || "",
          is_customer_booked: !!foundDay.is_customer_booked,
          meal_plan: foundDay.meal_plan || "BB",
          notes: foundDay.notes || "",
          rooms: (foundDay.rooms || []).map((r) => {
            const hotel = hotels.find(
              (h) => Number(h.id) === Number(foundDay.hotel_id)
            );
            const categories = hotel?.room_categories || [];
            const matchedCategory = categories.find(
              (c) =>
                c.name?.toLowerCase() ===
                r.room_category?.toLowerCase()
            );
            const pax = matchedCategory?.pax || null;

            return {
              room_category_id: matchedCategory?.id || "",
              room_category: r.room_category,
              room_type:
                r.room_type?.charAt(0).toUpperCase() +
                  r.room_type?.slice(1).toLowerCase() || "",
              pax: pax,
              count: r.room_count || 1,
              unit_price: r.unit_price || 0,
            };
          }),
        };
      });

      return {
        ...day,
        accommodation,
        is_customer_booked: apiOptions.some((opt) =>
          opt.days?.some(
            (d) =>
              Number(d.itinerary_day_id) === Number(day.id) &&
              d.is_customer_booked
          )
        ),
      };
    });

    updatedDays.forEach((d, i) => {
      onUpdateDay(i, {
        accommodation: d.accommodation,
        is_customer_booked: d.is_customer_booked,
      });
    });

    setInitialized(true);
  }, [apiOptions, days, initialized, onUpdateDay]);

  /** ========================= */
  useEffect(() => {
    dispatch(fetchHotels({ page: 1, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (quotationShell?.id) {
      dispatch(fetchQuotationOptions(quotationShell.id));
    }
  }, [quotationShell?.id, dispatch]);

  /** ========================= */
  const cityMap = useMemo(() => {
    const map = {};
    cities.forEach((c) => {
      map[c.id] = c.name || c.city || "-";
    });
    return map;
  }, [cities]);

  const normalizedHotels = hotels.map((h) => ({
    id: h.id,
    name: h.name,
    roomCategories: h.room_categories || [],
  }));

  /** ========================= */
  const addOptionColumn = () => {
    setGlobalOptions((prev) => [
      ...prev,
      {
        option_name: `Option ${prev.length + 1}`,
        option_index: prev.length,
      },
    ]);

    toast.success("New option column added");
  };

  /** ========================= */
  useEffect(() => {
    if (!apiOptions) return;

    if (!apiOptions.length) {
      setGlobalOptions([
        { option_name: "Option 1", option_index: 0 },
      ]);
      return;
    }

    const opts = apiOptions.map((opt) => ({
      option_name: opt.option_name,
      option_index: opt.option_index,
    }));

    setGlobalOptions(opts);
  }, [apiOptions]);

  /** ========================= */
  const copyOptionColumn = (fromIndex) => {
    const newIndex = globalOptions.length;

    setGlobalOptions((prev) => [
      ...prev,
      {
        option_name: `Option ${newIndex + 1}`,
        option_index: newIndex,
      },
    ]);

    days.forEach((day, i) => {
      const fromOption = day?.accommodation?.[fromIndex];
      if (!fromOption) return;

      const next = [...(day.accommodation || [])];

      next[newIndex] = {
        ...fromOption,
        option_name: `Option ${newIndex + 1}`,
        option_index: newIndex,
        rooms: JSON.parse(
          JSON.stringify(fromOption.rooms || [])
        ),
      };

      onUpdateDay(i, { accommodation: next });
    });

    toast.success("Option copied successfully");
  };

  /** ========================= */
  const handleSaveOptionColumn = async (optIndex) => {
    if (!quotationShell?.id) return;

    const optionMeta = globalOptions.find(
      (o) => o.option_index === optIndex
    );

    const payload = {
      quotation_id: quotationShell.id,
      option_name:
        optionMeta?.option_name ||
        `Option ${optIndex + 1}`,
      option_index: optIndex,
      hotesls: [],
    };

    days.forEach((day) => {
      const option = day?.accommodation?.[optIndex];
      if (!option) return;

      payload.hotesls.push({
        itinerary_day_id: day.id,
        hotel_id: option.hotel_id
          ? Number(option.hotel_id)
          : null,
        hotel_name_override: option.hotel_name_override,
        meal_plan: option.meal_plan,
        is_customer_booked: day.is_customer_booked || false,
        notes: option.notes,
        rooms: option.rooms || [],
      });
    });

    if (!payload.hotesls.length) {
      toast.error("Nothing to save");
      return;
    }

    const promise = dispatch(
      bulkSaveQuotationOptions(payload)
    );

    toast.promise(promise, {
      loading: "Saving option...",
      success: "Option saved successfully",
      error: "Save failed",
    });

    await promise;

    dispatch(fetchQuotationOptions(quotationShell.id));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-background overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-muted z-10">
            <TableRow>
              <TableHead className="min-w-[240px]">
                Day Info
              </TableHead>

              {globalOptions.map((opt) => {
                const collapsed =
                  collapsedOptions[opt.option_index];

                return (
                  <TableHead
                    key={opt.option_index}
                    className={`transition-all duration-300 ${
                      collapsed
                        ? "w-[70px]"
                        : "min-w-[420px]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {!collapsed && (
                        <div className="flex items-center gap-2">
                          {editingOption ===
                          opt.option_index ? (
                            <input
                              autoFocus
                              value={tempName}
                              onChange={(e) =>
                                setTempName(e.target.value)
                              }
                              onBlur={() =>
                                handleRename(opt)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleRename(opt);
                              }}
                              className="border px-2 py-1 rounded text-sm"
                            />
                          ) : (
                            <span
                              onClick={() => {
                                setEditingOption(
                                  opt.option_index
                                );
                                setTempName(
                                  opt.option_name
                                );
                              }}
                              className="cursor-pointer hover:underline"
                            >
                              {opt.option_name}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-1 items-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            toggleCollapse(
                              opt.option_index
                            )
                          }
                        >
                          {collapsed ? (
                            <>
                              <span className="text-xs">
                                {`O${opt.option_index + 1}`}
                              </span>
                              <ChevronRight className="h-4 w-4" />
                            </>
                          ) : (
                            <ChevronLeft className="h-4 w-4" />
                          )}
                        </Button>

                        {!collapsed && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                copyOptionColumn(
                                  opt.option_index
                                )
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                handleSaveOptionColumn(
                                  opt.option_index
                                )
                              }
                            >
                              <Save className="h-4 w-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                handleDelete(opt)
                              }
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </TableHead>
                );
              })}

              <TableHead className="min-w-[200px]">
                <Button size="sm" onClick={addOptionColumn}>
                  + Add
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {days.map((day, idx) => (
              <TableRow key={day.id || idx}>
                <TableCell>{day.date || "-"}</TableCell>

                {globalOptions.map((opt) => {
                  const collapsed =
                    collapsedOptions[opt.option_index];

                  return (
                    <TableCell key={opt.option_index}>
                      {!collapsed && (
                        <AccommodationCell
                          day={{ ...day, is_last_day: idx === days.length - 1 }}
                          optionIndex={opt.option_index}
                          hotels={normalizedHotels}
                          quotationshell={quotationShell}
                          value={
                            day?.accommodation?.[
                              opt.option_index
                            ]
                          }
                          onChange={(optionData) => {
                            const next = [
                              ...(day.accommodation || []),
                            ];
                            next[opt.option_index] =
                              optionData;

                            onUpdateDay(idx, {
                              accommodation: next,
                            });
                          }}
                        />
                      )}
                    </TableCell>
                  );
                })}

                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}