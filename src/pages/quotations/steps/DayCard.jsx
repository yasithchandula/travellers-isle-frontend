import { useMemo, useState } from "react";
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
  const standards =
    useSelector((s) => s.standardDescriptions?.items) || [];

  const startCityId = isFirstDay ? day.startCityId : prevDestinationId;
  const destinationId = day.destinationId;

  /* -------------------- Excursions -------------------- */
  const availableExcursions = useMemo(() => {
    if (!destinationId) return [];

    return excursions.filter(
      (e) =>
        e.status === "active" &&
        Array.isArray(e.assignedCityIds) &&
        e.assignedCityIds.map(Number).includes(Number(destinationId))
    );
  }, [excursions, destinationId]);

  /* -------------------- Standards -------------------- */
  const availableStandards = useMemo(() => {
    if (!startCityId || !destinationId) return [];

    return standards.filter(
      (s) =>
        Number(s.start_city_id) === Number(startCityId) &&
        Number(s.end_city_id) === Number(destinationId)
    );
  }, [standards, startCityId, destinationId]);

  /* -------------------- Search State -------------------- */
  const [stdQuery, setStdQuery] = useState("");
  const [stdOpen, setStdOpen] = useState(false);

  const filteredStandards = useMemo(() => {
    if (!stdQuery) return availableStandards;

    return availableStandards.filter((s) =>
      s.title.toLowerCase().includes(stdQuery.toLowerCase())
    );
  }, [availableStandards, stdQuery]);

  /* -------------------- Handlers -------------------- */
  function toggleExcursion(id) {
    const list = day.excursions || [];
    onUpdate({
      excursions: list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id],
    });
  }

  function applyStandard(std) {
    onUpdate({
      standardDescriptionId: std.id,
      description: std.description_html,
      custom: false,
    });
    setStdQuery(std.title);
    setStdOpen(false);
  }

  /* -------------------- UI -------------------- */
  return (
    <Card>
      {/* HEADER */}
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

      {/* STANDARD ITINERARY SEARCH */}
      {availableStandards.length > 0 && (
        <div className="mb-4 relative">
          <div className="text-sm font-semibold mb-1">
            Standard Itinerary
          </div>

          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Search standard itinerary..."
            value={stdQuery}
            onChange={(e) => {
              setStdQuery(e.target.value);
              setStdOpen(true);
            }}
            onFocus={() => setStdOpen(true)}
          />

          {stdOpen && (
            <div className="absolute z-30 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
              {filteredStandards.length > 0 ? (
                filteredStandards.map((s) => (
                  <div
                    key={s.id}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => applyStandard(s)}
                  >
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-gray-500">
                      {
                        cities.find(
                          (c) => c.id === s.start_city_id
                        )?.name
                      }{" "}
                      →{" "}
                      {
                        cities.find(
                          (c) => c.id === s.end_city_id
                        )?.name
                      }
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No matching itineraries
                </div>
              )}
            </div>
          )}
        </div>
      )}

            {/* EXCURSIONS */}
      {availableExcursions.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-semibold mb-1">
            Excursions (optional)
          </div>

          <div className="flex flex-wrap gap-2">
            {availableExcursions.map((e) => (
              <label
                key={e.id}
                className={`px-3 py-1 border rounded cursor-pointer text-sm
                  ${
                    day.excursions?.includes(e.id)
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

      {/* DESCRIPTION EDITOR */}
      <DescriptionEditor
        initialHTML={day.description}
        onChange={(html) =>
          onUpdate({ description: html, custom: true })
        }
      />
    </Card>
  );
}
