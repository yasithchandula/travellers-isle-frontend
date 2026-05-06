import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BedDouble,
  Car,
  Check,
  ChevronsUpDown,
  Copy,
  Hotel,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { fetchHotels } from "../../../../app/slices/hotelSlice";
import {
  bulkSaveQuotationOptions,
  fetchQuotationOptions,
  updateQuotationOption,
  deleteQuotationOption,
} from "../../../../app/slices/quotationSlice";

/** =========================
 * HELPERS
========================== */
const getRoomTypeFromPax = (pax) => {
  const n = Number(pax);

  if (n === 1) return "Single";
  if (n === 2) return "Double";
  if (n === 3) return "Triple";
  if (n >= 4) return "Family";

  return "";
};

const createEmptyOption = (dayId, index, optionName) => ({
  option_name: optionName || `Option ${index + 1}`,
  option_index: index,
  itinerary_day_id: dayId,
  hotel_id: null,
  hotel_name_override: "",
  meal_plan: "BB",
  notes: "",
  rooms: [],
  is_customer_booked: false,
  is_departure: false,

  driver_accommodation_enabled: false,
  driver_is_free: false,
  driver_price: 0,
});

const clone = (value) => JSON.parse(JSON.stringify(value || null));

const getDayTotal = (dayOption) => {
  const roomTotal = (dayOption?.rooms || []).reduce((sum, room) => {
    return sum + (Number(room.unit_price) || 0) * (Number(room.count) || 0);
  }, 0);

  const driverTotal =
    dayOption?.driver_accommodation_enabled && !dayOption?.driver_is_free
      ? Number(dayOption?.driver_price) || 0
      : 0;

  return roomTotal + driverTotal;
};

const normalizeRoomFromApi = (room, hotel) => {
  const categories = hotel?.room_categories || hotel?.roomCategories || [];

  const matchedCategory = categories.find(
    (category) =>
      category?.name?.toLowerCase() === room?.room_category?.toLowerCase()
  );

  const pax = matchedCategory?.pax || room?.pax || "";

  return {
    room_category_id: matchedCategory?.id || room?.room_category_id || "",
    room_category: room?.room_category || matchedCategory?.name || "",
    room_type: room?.room_type
      ? room.room_type.charAt(0).toUpperCase() +
      room.room_type.slice(1).toLowerCase()
      : getRoomTypeFromPax(pax),
    pax,
    count: room?.room_count || room?.count || 1,
    unit_price: room?.unit_price || 0,
  };
};

/** =========================
 * SHADCN HOTEL COMBOBOX
========================== */
function HotelCombobox({
  value,
  hotels = [],
  disabled = false,
  onChange,
  selectedOptionIndex,
  dayId,
}) {
  const [open, setOpen] = useState(false);

  const selectedHotel = hotels.find(
    (hotel) => String(hotel.id) === String(value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-7 w-full justify-between rounded-lg bg-background px-2 text-[11px] font-normal"
        >
          <span className="truncate">
            {selectedHotel?.name || "Select hotel"}
          </span>

          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="z-[10050] w-[280px] rounded-xl p-0"
        key={`hotel-popover-${selectedOptionIndex}-${dayId}`}
      >
        <Command>
          <CommandInput
            placeholder="Search hotel..."
            className="h-8 text-[11px]"
          />

          <CommandList>
            <CommandEmpty>No hotel found.</CommandEmpty>

            <CommandGroup>
              {hotels.map((hotel) => {
                const hotelId = String(hotel.id);
                const active = hotelId === String(value);

                return (
                  <CommandItem
                    key={hotelId}
                    value={hotelId}
                    keywords={[hotel.name || "", hotelId]}
                    onSelect={() => {
                      onChange(hotelId);
                      setOpen(false);
                    }}
                    className="cursor-pointer text-[11px]"
                  >
                    <Check
                      className={
                        active
                          ? "mr-2 h-3.5 w-3.5 opacity-100"
                          : "mr-2 h-3.5 w-3.5 opacity-0"
                      }
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] leading-tight">
                        {hotel.name}
                      </p>

                      <p className="text-[9px] leading-tight text-muted-foreground">
                        ID: {hotelId}
                      </p>
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

export default function AccommodationTableStep({
  days = [],
  cities = [],
  quotationShell,
  onUpdateDay,
}) {
  const dispatch = useDispatch();

  const { items: hotels = [] } = useSelector((state) => state.hotels);
  const { options: apiOptions = [], loading } = useSelector(
    (state) => state.quotations
  );

  const [optionMetas, setOptionMetas] = useState([
    {
      option_name: "Option 1",
      option_index: 0,
    },
  ]);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [isFullscreenTable, setIsFullscreenTable] = useState(false);

  /** =========================
   * LOAD API DATA
  ========================== */
  useEffect(() => {
    dispatch(fetchHotels({ page: 1, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    let active = true;

    const loadQuotationOptions = async () => {
      if (!quotationShell?.id) return;

      setHydrated(false);
      setOptionsLoaded(false);

      try {
        await dispatch(fetchQuotationOptions(quotationShell.id)).unwrap();
      } catch (error) {
        console.error("Failed to fetch quotation options:", error);
      } finally {
        if (active) {
          setOptionsLoaded(true);
        }
      }
    };

    loadQuotationOptions();

    return () => {
      active = false;
    };
  }, [quotationShell?.id, dispatch]);

  const refreshQuotationOptions = async () => {
    if (!quotationShell?.id) return;

    setOptionsLoaded(false);

    try {
      await dispatch(fetchQuotationOptions(quotationShell.id)).unwrap();
      setHydrated(false);
    } catch (error) {
      console.error("Failed to refresh quotation options:", error);
    } finally {
      setOptionsLoaded(true);
    }
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsFullscreenTable(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /** =========================
   * NORMALIZED DATA
  ========================== */
  const normalizedHotels = useMemo(() => {
    return (hotels || []).map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      roomCategories: hotel.room_categories || hotel.roomCategories || [],
      room_categories: hotel.room_categories || hotel.roomCategories || [],
    }));
  }, [hotels]);

  const cityMap = useMemo(() => {
    const map = {};

    (cities || []).forEach((city) => {
      map[String(city.id)] = city.name || city.city || "-";
    });

    return map;
  }, [cities]);

  const selectedMeta = useMemo(() => {
    return (
      optionMetas.find(
        (option) => Number(option.option_index) === Number(selectedOptionIndex)
      ) || optionMetas[0]
    );
  }, [optionMetas, selectedOptionIndex]);

  const quotationItineraryMap = useMemo(() => {
    const map = {};

    (quotationShell?.itinerary || []).forEach((item) => {
      map[Number(item.id)] = item;
    });

    return map;
  }, [quotationShell?.itinerary]);

  const getMileageValue = (day) => {
    const quotationDay = quotationItineraryMap[Number(day.id)];

    const actualMileage =
      Number(day?.actual_mileage) ||
      Number(quotationDay?.actual_mileage) ||
      Number(day?.standard_description?.mileage) ||
      Number(quotationDay?.standard_description?.mileage) ||
      0;

    const bufferMileage =
      Number(day?.buffer_mileage) || Number(quotationDay?.buffer_mileage) || 0;

    return {
      actualMileage,
      bufferMileage,
      totalMileage: actualMileage + bufferMileage,
    };
  };

  /** =========================
   * HYDRATE API OPTIONS INTO DAYS
  ========================== */
  useEffect(() => {
    if (hydrated) return;
    if (!optionsLoaded) return;
    if (!days?.length) return;
    if (loading) return;

    const hasApiRooms = apiOptions?.some((option) =>
      option.days?.some((apiDay) => (apiDay.rooms || []).length > 0)
    );

    if (hasApiRooms && !normalizedHotels?.length) return;

    if (!apiOptions?.length) {
      setOptionMetas([
        {
          option_name: "Option 1",
          option_index: 0,
        },
      ]);

      setSelectedOptionIndex(0);
      setHydrated(true);
      return;
    }

    const metas = apiOptions
      .map((option) => ({
        option_name:
          option.option_name || `Option ${Number(option.option_index) + 1}`,
        option_index: Number(option.option_index),
      }))
      .sort((a, b) => Number(a.option_index) - Number(b.option_index));

    setOptionMetas(metas);

    if (
      !metas.some(
        (meta) => Number(meta.option_index) === Number(selectedOptionIndex)
      )
    ) {
      setSelectedOptionIndex(Number(metas[0]?.option_index ?? 0));
    }

    days.forEach((day, dayIndex) => {
      const accommodation = [...(day.accommodation || [])];

      apiOptions.forEach((apiOption) => {
        const optionIndex = Number(apiOption.option_index);

        const foundDay = apiOption.days?.find(
          (apiDay) => Number(apiDay.itinerary_day_id) === Number(day.id)
        );

        if (!foundDay) return;

        const hotel = normalizedHotels.find(
          (hotel) => Number(hotel.id) === Number(foundDay.hotel_id)
        );

        accommodation[optionIndex] = {
          option_name:
            apiOption.option_name || `Option ${Number(optionIndex) + 1}`,
          option_index: optionIndex,
          itinerary_day_id: day.id,
          hotel_id: foundDay.hotel_id || null,
          hotel_name_override: foundDay.hotel_name_override || "",
          meal_plan: foundDay.meal_plan || "BB",
          notes: foundDay.notes || "",
          is_customer_booked: !!foundDay.is_customer_booked,
          is_departure: !!foundDay.is_departure,

          driver_accommodation_enabled:
            !!foundDay.driver_accommodation_enabled,
          driver_is_free: !!foundDay.driver_is_free,
          driver_price: Number(foundDay.driver_price) || 0,

          rooms: (foundDay.rooms || []).map((room) =>
            normalizeRoomFromApi(room, hotel)
          ),
        };
      });

      const isCustomerBooked = apiOptions.some((option) =>
        option.days?.some(
          (apiDay) =>
            Number(apiDay.itinerary_day_id) === Number(day.id) &&
            !!apiDay.is_customer_booked
        )
      );

      onUpdateDay(dayIndex, {
        accommodation,
        is_customer_booked: isCustomerBooked,
      });
    });

    setHydrated(true);
  }, [
    hydrated,
    optionsLoaded,
    loading,
    apiOptions,
    days,
    normalizedHotels,
    onUpdateDay,
    selectedOptionIndex,
  ]);

  /** =========================
   * SELECTED GRID DAYS
  ========================== */
  const gridDays = useMemo(() => {
    return (days || []).map((day, index) => {
      const option =
        day?.accommodation?.[selectedOptionIndex] ||
        createEmptyOption(
          day.id,
          selectedOptionIndex,
          selectedMeta?.option_name
        );

      const mileageData = getMileageValue(day);

      return {
        ...option,

        id: day.id,
        itinerary_day_id: day.id,
        day_number: day.day_number || index + 1,
        date: day.date,

        starting_city_id: day.starting_city_id || day.start_city_id || "",
        destination_city_id: day.destination_city_id || day.end_city_id || "",

        start_city_id: day.starting_city_id || day.start_city_id || "",
        end_city_id: day.destination_city_id || day.end_city_id || "",

        start_city_name: day.start_city_name || day.starting_city_name || "",
        end_city_name: day.end_city_name || day.destination_city_name || "",

        start_city: day.start_city || day.starting_city || null,
        end_city: day.end_city || day.destination_city || null,

        standard_description: day.standard_description || null,
        standard_description_id: day.standard_description_id || null,
        stop_ids: day.stop_ids || [],
        excursions: day.excursions || [],

        actual_mileage: mileageData.actualMileage,
        buffer_mileage: mileageData.bufferMileage,
        total_mileage: mileageData.totalMileage,

        is_last_day: index === days.length - 1,
        is_departure: !!(option?.is_departure || day?.is_departure),
      };
    });
  }, [days, selectedOptionIndex, selectedMeta, quotationItineraryMap]);

  const grandTotal = useMemo(() => {
    return gridDays.reduce((sum, day) => sum + getDayTotal(day), 0);
  }, [gridDays]);

  /** =========================
   * UPDATE HELPERS
  ========================== */
  const updateDay = (dayIndex, patch) => {
    const sourceDay = days[dayIndex];
    if (!sourceDay) return;

    const currentOption =
      sourceDay?.accommodation?.[selectedOptionIndex] ||
      createEmptyOption(
        sourceDay.id,
        selectedOptionIndex,
        selectedMeta?.option_name
      );

    const nextOption = {
      ...currentOption,
      ...patch,
      option_name:
        selectedMeta?.option_name || `Option ${selectedOptionIndex + 1}`,
      option_index: selectedOptionIndex,
      itinerary_day_id: sourceDay.id,
    };

    const nextAccommodation = [...(sourceDay.accommodation || [])];
    nextAccommodation[selectedOptionIndex] = nextOption;

    const nextIsCustomerBooked = nextAccommodation.some(
      (option) => !!option?.is_customer_booked
    );

    onUpdateDay(dayIndex, {
      accommodation: nextAccommodation,
      is_customer_booked: nextIsCustomerBooked,
    });
  };

  const updateRoom = (dayIndex, roomIndex, patch) => {
    const day = gridDays[dayIndex];
    if (!day) return;

    const rooms = [...(day.rooms || [])];

    rooms[roomIndex] = {
      ...rooms[roomIndex],
      ...patch,
    };

    updateDay(dayIndex, { rooms });
  };

  const addRoom = (dayIndex) => {
    const day = gridDays[dayIndex];
    if (!day?.hotel_id) {
      toast.error("Select a hotel first");
      return;
    }

    const selectedHotel = normalizedHotels.find(
      (hotel) => Number(hotel.id) === Number(day.hotel_id)
    );

    const firstCategory = selectedHotel?.roomCategories?.[0];

    const nextRoom = {
      room_category_id: firstCategory?.id || "",
      room_category: firstCategory?.name || "",
      pax: firstCategory?.pax || "",
      room_type: getRoomTypeFromPax(firstCategory?.pax),
      count: 1,
      unit_price: firstCategory?.price || 0,
    };

    updateDay(dayIndex, {
      rooms: [...(day.rooms || []), nextRoom],
    });
  };

  const removeRoom = (dayIndex, roomIndex) => {
    const day = gridDays[dayIndex];

    updateDay(dayIndex, {
      rooms: (day.rooms || []).filter((_, index) => index !== roomIndex),
    });
  };

  const duplicateRoom = (dayIndex, roomIndex) => {
    const day = gridDays[dayIndex];
    const rooms = [...(day.rooms || [])];

    rooms.splice(roomIndex + 1, 0, clone(rooms[roomIndex]));

    updateDay(dayIndex, { rooms });
  };

  const handleHotelChange = (dayIndex, hotelId) => {
    const selectedHotel = normalizedHotels.find(
      (hotel) => Number(hotel.id) === Number(hotelId)
    );

    updateDay(dayIndex, {
      hotel_id: hotelId,
      hotel_name_override: selectedHotel?.name || "",
      rooms: [],
    });
  };

  /** =========================
   * CUSTOMER BOOKED
  ========================== */
  const handleCustomerBooked = async (dayIndex, checked) => {
    const sourceDay = days[dayIndex];
    if (!sourceDay) return;

    if (checked) {
      const clearedOption = {
        ...createEmptyOption(
          sourceDay.id,
          selectedOptionIndex,
          selectedMeta?.option_name
        ),
        is_customer_booked: true,
      };

      const nextAccommodation = [...(sourceDay.accommodation || [])];
      nextAccommodation[selectedOptionIndex] = clearedOption;

      onUpdateDay(dayIndex, {
        accommodation: nextAccommodation,
        is_customer_booked: true,
      });

      const payload = {
        quotation_id: quotationShell?.id,
        option_name:
          selectedMeta?.option_name || `Option ${selectedOptionIndex + 1}`,
        option_index: selectedOptionIndex,
        hotesls: [
          {
            itinerary_day_id: sourceDay.id,
            hotel_id: null,
            hotel_name_override: "",
            meal_plan: "BB",
            is_customer_booked: true,
            is_departure: false,
            notes: "",
            rooms: [],
            driver_accommodation_enabled: false,
            driver_is_free: false,
            driver_price: 0,
          },
        ],
      };

      try {
        const promise = dispatch(bulkSaveQuotationOptions(payload)).unwrap();

        toast.promise(promise, {
          loading: "Updating customer booked status...",
          success: "Marked as customer booked",
          error: "Failed to update customer booked status",
        });

        await promise;
        await refreshQuotationOptions();
      } catch (error) {
        console.error("Failed to update customer booked status:", error);
      }

      return;
    }

    updateDay(dayIndex, {
      is_customer_booked: false,
    });
  };

  /** =========================
   * OPTION ACTIONS
  ========================== */
  const handleAddOption = () => {
    const maxIndex = optionMetas.length
      ? Math.max(...optionMetas.map((option) => Number(option.option_index)))
      : -1;

    const nextIndex = maxIndex + 1;

    const nextOption = {
      option_name: `Option ${nextIndex + 1}`,
      option_index: nextIndex,
    };

    setOptionMetas((prev) => [...prev, nextOption]);
    setSelectedOptionIndex(nextIndex);
    setEditingName(false);

    toast.success("New option added");
  };

  const handleCopyOption = () => {
    const maxIndex = optionMetas.length
      ? Math.max(...optionMetas.map((option) => Number(option.option_index)))
      : -1;

    const nextIndex = maxIndex + 1;

    const nextOptionMeta = {
      option_name: `Option ${nextIndex + 1}`,
      option_index: nextIndex,
    };

    days.forEach((day, dayIndex) => {
      const currentOption =
        day?.accommodation?.[selectedOptionIndex] ||
        createEmptyOption(
          day.id,
          selectedOptionIndex,
          selectedMeta?.option_name
        );

      const copiedOption = {
        ...clone(currentOption),
        option_name: nextOptionMeta.option_name,
        option_index: nextIndex,
        itinerary_day_id: day.id,
        rooms: clone(currentOption.rooms || []),
      };

      const nextAccommodation = [...(day.accommodation || [])];
      nextAccommodation[nextIndex] = copiedOption;

      onUpdateDay(dayIndex, {
        accommodation: nextAccommodation,
      });
    });

    setOptionMetas((prev) => [...prev, nextOptionMeta]);
    setSelectedOptionIndex(nextIndex);
    setEditingName(false);

    toast.success("Option copied successfully");
  };

  const handleRenameOption = async () => {
    const cleanName = tempName.trim();

    if (!cleanName) {
      toast.error("Option name is required");
      return;
    }

    setOptionMetas((prev) =>
      prev.map((option) =>
        Number(option.option_index) === Number(selectedOptionIndex)
          ? {
            ...option,
            option_name: cleanName,
          }
          : option
      )
    );

    days.forEach((day, dayIndex) => {
      const option = day?.accommodation?.[selectedOptionIndex];
      if (!option) return;

      const nextAccommodation = [...(day.accommodation || [])];
      nextAccommodation[selectedOptionIndex] = {
        ...option,
        option_name: cleanName,
      };

      onUpdateDay(dayIndex, {
        accommodation: nextAccommodation,
      });
    });

    setEditingName(false);

    if (!quotationShell?.id) return;

    const existsInApi = apiOptions.some(
      (option) => Number(option.option_index) === Number(selectedOptionIndex)
    );

    if (!existsInApi) {
      toast.success("Option renamed locally");
      return;
    }

    try {
      const promise = dispatch(
        updateQuotationOption({
          quotationId: quotationShell.id,
          optionIndex: selectedOptionIndex,
          payload: {
            option_name: cleanName,
          },
        })
      ).unwrap();

      toast.promise(promise, {
        loading: "Renaming option...",
        success: "Option renamed successfully",
        error: "Failed to rename option",
      });

      await promise;
      await refreshQuotationOptions();
    } catch (error) {
      console.error("Failed to rename option:", error);
    }
  };

  const handleDeleteOption = async () => {
    if (optionMetas.length <= 1) {
      toast.error("At least one option is required");
      return;
    }

    const deletingIndex = selectedOptionIndex;

    const nextMetas = optionMetas.filter(
      (option) => Number(option.option_index) !== Number(deletingIndex)
    );

    const nextSelectedIndex = Number(nextMetas[0]?.option_index ?? 0);

    setOptionMetas(nextMetas);
    setSelectedOptionIndex(nextSelectedIndex);
    setEditingName(false);

    days.forEach((day, dayIndex) => {
      const nextAccommodation = [...(day.accommodation || [])];
      delete nextAccommodation[deletingIndex];

      onUpdateDay(dayIndex, {
        accommodation: nextAccommodation,
      });
    });

    if (!quotationShell?.id) {
      toast.success("Option removed");
      return;
    }

    const existsInApi = apiOptions.some(
      (option) => Number(option.option_index) === Number(deletingIndex)
    );

    if (!existsInApi) {
      toast.success("Option removed");
      return;
    }

    try {
      const promise = dispatch(
        deleteQuotationOption({
          quotationId: quotationShell.id,
          optionIndex: deletingIndex,
        })
      ).unwrap();

      toast.promise(promise, {
        loading: "Deleting option...",
        success: "Option deleted",
        error: "Delete failed",
      });

      await promise;
      await refreshQuotationOptions();
    } catch (error) {
      console.error("Failed to delete option:", error);
    }
  };

  /** =========================
   * SAVE OPTION
  ========================== */
  const handleSaveOption = async () => {
    if (!quotationShell?.id) {
      toast.error("Quotation id not found");
      return;
    }

    const payload = {
      quotation_id: quotationShell.id,
      option_name:
        selectedMeta?.option_name || `Option ${selectedOptionIndex + 1}`,
      option_index: selectedOptionIndex,
      hotesls: [],
    };

    days.forEach((day) => {
      const option =
        day?.accommodation?.[selectedOptionIndex] ||
        createEmptyOption(
          day.id,
          selectedOptionIndex,
          selectedMeta?.option_name
        );

      payload.hotesls.push({
        itinerary_day_id: day.id,
        hotel_id: option.hotel_id ? Number(option.hotel_id) : null,
        hotel_name_override: option.hotel_name_override || "",
        meal_plan: option.meal_plan || "BB",
        is_customer_booked: !!option.is_customer_booked,
        is_departure: !!option.is_departure,
        notes: option.notes || "",

        driver_accommodation_enabled: !!option.driver_accommodation_enabled,
        driver_is_free: !!option.driver_is_free,
        driver_price: Number(option.driver_price) || 0,

        rooms: (option.rooms || []).map((room) => ({
          room_category_id: room.room_category_id
            ? Number(room.room_category_id)
            : null,
          room_category: room.room_category || "",
          room_type: room.room_type || "",
          pax: room.pax || "",
          room_count: Number(room.count) || 1,
          count: Number(room.count) || 1,
          unit_price: Number(room.unit_price) || 0,
        })),
      });
    });

    try {
      const savePromise = dispatch(bulkSaveQuotationOptions(payload)).unwrap();

      toast.promise(savePromise, {
        loading: "Saving option...",
        success: "Option saved successfully",
        error: "Save failed",
      });

      await savePromise;
      await refreshQuotationOptions();
    } catch (error) {
      console.error("Save option failed:", error);
    }
  };

  const getCityName = (cityValue) => {
    if (!cityValue) return "-";

    if (typeof cityValue === "object") {
      return cityValue.name || cityValue.city || cityValue.label || "-";
    }

    return cityMap[String(cityValue)] || "-";
  };

  const getDayStartCity = (day) => {
    return (
      day.start_city_name ||
      day.starting_city_name ||
      day.start_city?.name ||
      day.start_city?.city ||
      getCityName(day.starting_city_id || day.start_city_id)
    );
  };

  const getDayEndCity = (day) => {
    return (
      day.end_city_name ||
      day.destination_city_name ||
      day.end_city?.name ||
      day.end_city?.city ||
      getCityName(day.destination_city_id || day.end_city_id)
    );
  };

  return (
    <div
      className={
        isFullscreenTable
          ? "fixed inset-0 z-[9999] bg-background p-3"
          : "space-y-3"
      }
    >
      {/* TOP AIRTABLE BAR */}
      <div className="sticky top-0 z-30 rounded-2xl border bg-background/95 px-3 py-2.5 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(selectedOptionIndex)}
              onValueChange={(value) => {
                setSelectedOptionIndex(Number(value));
                setEditingName(false);
              }}
            >
              <SelectTrigger className="h-8 w-[190px] rounded-xl text-xs">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>

              <SelectContent className="z-[10050]">
                {optionMetas.map((option) => (
                  <SelectItem
                    key={option.option_index}
                    value={String(option.option_index)}
                  >
                    {option.option_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {editingName ? (
              <div className="flex items-center gap-1">
                <Input
                  autoFocus
                  value={tempName}
                  onChange={(event) => setTempName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleRenameOption();
                    if (event.key === "Escape") setEditingName(false);
                  }}
                  className="h-8 w-[190px] rounded-xl text-xs"
                />

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-xl"
                  onClick={handleRenameOption}
                >
                  <Check className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-xl"
                  onClick={() => setEditingName(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl px-2.5 text-xs"
                onClick={() => {
                  setTempName(selectedMeta?.option_name || "");
                  setEditingName(true);
                }}
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Rename
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl px-2.5 text-xs"
              onClick={handleAddOption}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl px-2.5 text-xs"
              onClick={handleCopyOption}
            >
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Copy
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl px-2.5 text-xs text-red-500 hover:text-red-600"
              onClick={handleDeleteOption}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-xl border bg-muted/30 px-3 py-1.5 text-right">
              <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                Grand Total
              </p>
              <p className="text-sm font-bold leading-tight">
                {grandTotal.toLocaleString()}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-xl px-2.5 text-xs"
              onClick={() => setIsFullscreenTable((prev) => !prev)}
            >
              {isFullscreenTable ? (
                <>
                  <Minimize2 className="mr-1.5 h-3.5 w-3.5" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
                  Fullscreen
                </>
              )}
            </Button>

            <Button
              className="h-8 rounded-xl px-3 text-xs"
              disabled={loading || !optionsLoaded}
              onClick={handleSaveOption}
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Option
            </Button>
          </div>
        </div>
      </div>

      {/* COMPACT AIRTABLE GRID */}
      <div
        className="overflow-hidden rounded-2xl border bg-background shadow-sm"
        key={`table-shell-${selectedOptionIndex}`}
      >
        <div
          className={
            isFullscreenTable
              ? "max-h-[calc(100vh-88px)] overflow-auto"
              : "max-h-[calc(100vh-235px)] overflow-auto"
          }
        >
          <table className="w-full min-w-[1120px] table-fixed border-separate border-spacing-0 text-sm">
            <colgroup>
              <col className="w-[130px]" />
              <col className="w-[285px]" />
              <col className="w-[470px]" />
              <col className="w-[105px]" />
              <col className="w-[130px]" />
            </colgroup>

            <thead className="sticky top-0 z-20 bg-muted">
              <tr>
                <th className="sticky left-0 z-30 border-b border-r bg-muted px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Day
                </th>

                <th className="border-b border-r px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Hotel / Meal / Customer
                </th>

                <th className="border-b border-r px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Rooms / Driver
                </th>

                <th className="border-b border-r px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Total
                </th>

                <th className="border-b px-2.5 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Notes
                </th>
              </tr>
            </thead>

            <tbody key={`tbody-option-${selectedOptionIndex}`}>
              {gridDays.map((day, dayIndex) => {
                const selectedHotel = normalizedHotels.find(
                  (hotel) => Number(hotel.id) === Number(day.hotel_id)
                );

                const disabled = !!day.is_customer_booked;

                return (
                  <tr
                    key={`${selectedOptionIndex}-${day.id || dayIndex}`}
                    className="group transition-colors hover:bg-muted/20"
                  >
                    {/* DAY */}
                    <td className="sticky left-0 z-10 border-b border-r bg-background px-2.5 py-2 align-top group-hover:bg-muted/30">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold leading-tight">
                            Day {day.day_number || dayIndex + 1}
                          </p>

                          {day.is_last_day && (
                            <Badge className="rounded-full px-1.5 py-0 text-[8px]">
                              Last
                            </Badge>
                          )}
                        </div>

                        <p className="text-[10px] leading-tight text-muted-foreground">
                          {day.date || "-"}
                        </p>

                        <div className="max-w-[115px] rounded-lg border bg-muted/20 px-1.5 py-1">
                          <p className="truncate text-[9px] font-medium leading-tight text-foreground">
                            {getDayStartCity(day)}
                          </p>

                          <p className="truncate text-[9px] leading-tight text-muted-foreground">
                            ↓ {getDayEndCity(day)}
                          </p>

                          <div className="mt-1 border-t pt-1">
                            <p className="text-[9px] font-medium leading-tight text-foreground">
                              {Number(day.total_mileage || 0).toLocaleString()}{" "}
                              km
                            </p>

                            {!!Number(day.buffer_mileage || 0) && (
                              <p className="text-[8px] leading-tight text-muted-foreground">
                                Actual{" "}
                                {Number(
                                  day.actual_mileage || 0
                                ).toLocaleString()}{" "}
                                + Buffer{" "}
                                {Number(
                                  day.buffer_mileage || 0
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* HOTEL / MEAL / CUSTOMER */}
                    <td className="border-b border-r px-2 py-2 align-top">
                      <div className="space-y-1.5 rounded-xl border bg-muted/10 p-1.5">
                        <div className="grid grid-cols-[1fr_64px] gap-1.5">
                          <HotelCombobox
                            key={`hotel-${selectedOptionIndex}-${day.id}`}
                            value={day.hotel_id ? String(day.hotel_id) : ""}
                            hotels={normalizedHotels}
                            disabled={disabled}
                            selectedOptionIndex={selectedOptionIndex}
                            dayId={day.id}
                            onChange={(value) =>
                              handleHotelChange(dayIndex, value)
                            }
                          />

                          <Select
                            key={`meal-${selectedOptionIndex}-${day.id}`}
                            value={day.meal_plan || "BB"}
                            onValueChange={(value) =>
                              updateDay(dayIndex, {
                                meal_plan: value,
                              })
                            }
                            disabled={disabled}
                          >
                            <SelectTrigger className="h-7 rounded-lg bg-background px-2 text-[11px]">
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent className="z-[10050]">
                              <SelectItem value="BB">BB</SelectItem>
                              <SelectItem value="HB">HB</SelectItem>
                              <SelectItem value="FB">FB</SelectItem>
                              <SelectItem value="RO">RO</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Input
                          key={`override-${selectedOptionIndex}-${day.id}`}
                          value={day.hotel_name_override || ""}
                          disabled={disabled}
                          placeholder="Override name"
                          className="h-7 rounded-lg bg-background px-2 text-[11px]"
                          onChange={(event) =>
                            updateDay(dayIndex, {
                              hotel_name_override: event.target.value,
                            })
                          }
                        />

                        <div className="flex h-7 items-center justify-between rounded-lg border bg-background px-2">
                          <div className="min-w-0">
                            <p className="truncate text-[10px] font-medium leading-tight">
                              Customer Booked
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-muted-foreground">
                              {day.is_customer_booked ? "Booked" : "Internal"}
                            </span>

                            <Switch
                              key={`customer-${selectedOptionIndex}-${day.id}`}
                              checked={!!day.is_customer_booked}
                              onCheckedChange={(value) =>
                                handleCustomerBooked(dayIndex, value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ROOMS + DRIVER */}
                    <td className="border-b border-r px-2 py-2 align-top">
                      <div className="space-y-1.5">
                        {(day.rooms || []).length === 0 && (
                          <div className="flex h-7 items-center rounded-lg border border-dashed bg-muted/20 px-2 text-[11px] text-muted-foreground">
                            No rooms added
                          </div>
                        )}

                        {(day.rooms || []).map((room, roomIndex) => (
                          <div
                            key={`${selectedOptionIndex}-${day.id}-${roomIndex}`}
                            className="grid grid-cols-[minmax(120px,1fr)_58px_44px_68px_72px_54px] items-center gap-1 rounded-lg border bg-muted/10 p-1"
                          >
                            <Select
                              key={`room-category-${selectedOptionIndex}-${day.id}-${roomIndex}`}
                              value={
                                room.room_category_id
                                  ? String(room.room_category_id)
                                  : ""
                              }
                              onValueChange={(value) => {
                                const selectedCategory =
                                  selectedHotel?.roomCategories?.find(
                                    (category) =>
                                      String(category.id) === String(value)
                                  );

                                updateRoom(dayIndex, roomIndex, {
                                  room_category_id: value,
                                  room_category: selectedCategory?.name || "",
                                  pax: selectedCategory?.pax || "",
                                  room_type: getRoomTypeFromPax(
                                    selectedCategory?.pax
                                  ),
                                  unit_price: selectedCategory?.price || 0,
                                });
                              }}
                              disabled={disabled || !selectedHotel}
                            >
                              <SelectTrigger className="h-7 rounded-md bg-background px-2 text-[10px]">
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>

                              <SelectContent className="z-[10050]">
                                {(selectedHotel?.roomCategories || []).map(
                                  (category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={String(category.id)}
                                    >
                                      {category.name} ({category.pax} pax)
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>

                            <Input
                              value={room.room_type || ""}
                              disabled
                              className="h-7 rounded-md bg-background px-1.5 text-[10px]"
                              placeholder="Type"
                            />

                            <Input
                              type="number"
                              min="1"
                              value={room.count ?? 1}
                              disabled={disabled}
                              onChange={(event) =>
                                updateRoom(dayIndex, roomIndex, {
                                  count: Number(event.target.value),
                                })
                              }
                              className="h-7 rounded-md bg-background px-1.5 text-[10px]"
                            />

                            <Input
                              type="number"
                              min="0"
                              value={room.unit_price ?? 0}
                              disabled={disabled}
                              onChange={(event) =>
                                updateRoom(dayIndex, roomIndex, {
                                  unit_price: Number(event.target.value),
                                })
                              }
                              className="h-7 rounded-md bg-background px-1.5 text-[10px]"
                            />

                            <div className="flex h-7 items-center justify-end rounded-md border bg-background px-1.5 text-[10px] font-semibold">
                              {(
                                (Number(room.unit_price) || 0) *
                                (Number(room.count) || 0)
                              ).toLocaleString()}
                            </div>

                            <div className="flex items-center justify-end gap-0.5">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 rounded-md"
                                disabled={disabled}
                                onClick={() =>
                                  duplicateRoom(dayIndex, roomIndex)
                                }
                              >
                                <Copy className="h-3 w-3" />
                              </Button>

                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 rounded-md text-red-500 hover:text-red-600"
                                disabled={disabled}
                                onClick={() => removeRoom(dayIndex, roomIndex)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <div className="flex flex-wrap items-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={disabled || !day.hotel_id}
                            className="h-7 rounded-lg border-dashed bg-background px-2.5 text-[10px] font-medium hover:bg-muted"
                            onClick={() => addRoom(dayIndex)}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Room
                          </Button>

                          <div className="flex min-h-7 flex-wrap items-center gap-1.5 rounded-lg border bg-muted/10 px-2 py-1">
                            <div className="flex items-center gap-1">
                              <Car className="h-3 w-3 text-muted-foreground" />
                              <span className="text-[10px] font-medium">
                                Driver
                              </span>
                            </div>

                            <Switch
                              key={`driver-enabled-${selectedOptionIndex}-${day.id}`}
                              checked={!!day.driver_accommodation_enabled}
                              disabled={disabled}
                              onCheckedChange={(value) =>
                                updateDay(dayIndex, {
                                  driver_accommodation_enabled: value,
                                  driver_is_free: value
                                    ? !!day.driver_is_free
                                    : false,
                                  driver_price: value
                                    ? Number(day.driver_price) || 0
                                    : 0,
                                })
                              }
                            />

                            {day.driver_accommodation_enabled && (
                              <>
                                <div className="flex h-6 items-center gap-1 rounded-md border bg-background px-1.5">
                                  <span className="text-[9px]">Free</span>

                                  <Switch
                                    key={`driver-free-${selectedOptionIndex}-${day.id}`}
                                    checked={!!day.driver_is_free}
                                    disabled={disabled}
                                    onCheckedChange={(value) =>
                                      updateDay(dayIndex, {
                                        driver_is_free: value,
                                        driver_price: value
                                          ? 0
                                          : Number(day.driver_price) || 0,
                                      })
                                    }
                                  />
                                </div>

                                <Input
                                  key={`driver-price-${selectedOptionIndex}-${day.id}`}
                                  type="number"
                                  min="0"
                                  value={day.driver_price || ""}
                                  disabled={disabled || day.driver_is_free}
                                  placeholder="Price"
                                  className="h-6 w-[74px] rounded-md bg-background px-1.5 text-[10px]"
                                  onChange={(event) =>
                                    updateDay(dayIndex, {
                                      driver_price: Number(event.target.value),
                                    })
                                  }
                                />
                              </>
                            )}

                            {day.is_last_day && (
                              <div className="flex h-6 items-center gap-1 rounded-md border bg-background px-1.5">
                                <span className="text-[9px]">Dep.</span>

                                <Switch
                                  key={`departure-${selectedOptionIndex}-${day.id}`}
                                  checked={!!day.is_departure}
                                  disabled={disabled}
                                  onCheckedChange={(value) =>
                                    updateDay(dayIndex, {
                                      is_departure: value,
                                    })
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td className="border-b border-r px-2 py-2 align-top">
                      <div className="rounded-xl border bg-muted/20 px-2 py-1.5 text-right">
                        <p className="text-[8px] uppercase tracking-wide text-muted-foreground">
                          Day Total
                        </p>

                        <p className="text-xs font-bold leading-tight">
                          {getDayTotal(day).toLocaleString()}
                        </p>
                      </div>
                    </td>

                    {/* NOTES */}
                    <td className="border-b px-2 py-2 align-top">
                      <Input
                        key={`notes-${selectedOptionIndex}-${day.id}`}
                        value={day.notes || ""}
                        disabled={disabled}
                        placeholder="Notes..."
                        className="h-7 rounded-lg bg-transparent px-2 text-[11px] hover:bg-background"
                        onChange={(event) =>
                          updateDay(dayIndex, {
                            notes: event.target.value,
                          })
                        }
                      />
                    </td>
                  </tr>
                );
              })}

              {!gridDays.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="border-b px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    <Hotel className="mx-auto mb-2 h-8 w-8 opacity-60" />
                    No itinerary days found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}