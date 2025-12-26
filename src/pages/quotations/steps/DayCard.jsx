import { useMemo } from "react";
import { useSelector } from "react-redux";
import Card from "../../../components/common/Card";
import DescriptionEditor from "./editor/DescriptionEditor";

export default function DayCard({
  day,
  isFirstDay,
  prevDestinationId,
  onUpdate,
}) {
  const cities = useSelector((s) => s.cities?.items) || [];
  const excursions = useSelector((s) => s.excursions?.items) || [];
  const standards = useSelector(s => s.standardDescriptions?.items || []);
  console.log("STANDARDS:", standards);


  const startCityId = isFirstDay ? day.startCityId : prevDestinationId;
  const destinationId = day.destinationId;

  const availableExcursions = useMemo(() => {
    if (!destinationId) return [];

    return excursions.filter(
      (e) =>
        e.status === "active" &&
        Array.isArray(e.assignedCityIds) &&
        e.assignedCityIds.map(Number).includes(Number(destinationId))
    );
  }, [excursions, destinationId]);

  const availableStops = useMemo(() => {
    if (!destinationId) return [];

    return cities.filter(
      (c) => Number(c.id) !== Number(destinationId)
    );
  }, [cities, destinationId]);

  const availableStandards = useMemo(() => {
    if (!startCityId || !destinationId) return [];

    return standards.filter(
      (s) =>
        Number(s.start_city_id) === Number(startCityId) &&
        Number(s.end_city_id) === Number(destinationId)
    );
  }, [standards, startCityId, destinationId]);





  function toggleExcursion(id) {
    const list = day.excursions || [];
    onUpdate({
      excursions: list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id],
    });
  }

  return (
    <Card>
      <div className="text-lg font-semibold">
        Day {day.day}
      </div>

      {/* DATE */}
      <div className="text-sm text-gray-500 mb-2">
        {day.date}
      </div>

      {/* ROUTE */}
      <div className="text-sm text-gray-700 mb-3">
        {cities.find((c) => c.id === startCityId)?.name} →{" "}
        {cities.find((c) => c.id === destinationId)?.name}
      </div>

      {/* EXCURSIONS (OPTIONAL) */}
      {availableExcursions.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-semibold mb-1">
            Excursions (optional)
          </div>

          <div className="flex flex-wrap gap-2">
            {availableExcursions.map((e) => (
              <label
                key={e.id}
                className={`px-3 py-1 border rounded cursor-pointer text-sm
                  ${day.excursions?.includes(e.id)
                    ? "bg-green-100 border-green-400"
                    : "bg-white"
                  }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={day.excursions?.includes(e.id) || false}
                  onChange={() => toggleExcursion(e.id)}
                />
                {e.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {availableStandards.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-semibold mb-1">
            Standard Itinerary
          </div>

          <select
            className="w-full border rounded px-2 py-1"
            value={day.standardDescriptionId || ""}
            onChange={(e) => {
              const std = availableStandards.find(
                (s) => s.id === Number(e.target.value)
              );
              if (!std) return;

              onUpdate({
                standardDescriptionId: std.id,
                description: std.description_html,
                custom: false,
              });
            }}
          >
            <option value="">Select standard itinerary</option>
            {availableStandards.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      )}


      {/* DESCRIPTION */}
      <DescriptionEditor
        initialHTML={day.description}
        onChange={(html) =>
          onUpdate({ description: html, custom: true })
        }
      />
    </Card>
  );
}
