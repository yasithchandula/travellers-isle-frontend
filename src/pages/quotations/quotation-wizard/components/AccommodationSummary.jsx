function AccommodationSummary({ day, onEdit }) {
  const selected =
    day.accommodation?.options?.find((o) => o.meta?.isSelected);

  return (
    <div className="flex items-center justify-between border rounded-lg px-3 py-2 bg-muted/30">
      <div className="text-sm">
        {selected
          ? `${selected.hotel_name || "Hotel"} • ${
              selected.room_name || "Room"
            } • ${selected.pricing.sell}`
          : "No hotel selected"}
      </div>

      <Button size="sm" variant="ghost" onClick={onEdit}>
        Edit
      </Button>
    </div>
  );
}