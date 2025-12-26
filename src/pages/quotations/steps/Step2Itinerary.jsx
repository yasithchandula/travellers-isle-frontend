import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import DayCard from "./DayCard";
import { useDispatch } from "react-redux";
import { fetchCities } from "../../../app/slices/citySlice";
import { fetchExcursions } from "../../../app/slices/excursionSlice";
import { fetchStandardDescriptions } from "../../../app/slices/standardDescriptionSlice";

// ✅ REQUIRED helper
function addDays(baseDate, offset) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export default function Step2Itinerary({
  tourEntry,
  itinerary,
  onChange,
  next,
  back,
}) {
  const dispatch = useDispatch();
  const cities = useSelector((s) => s.cities?.items) || [];

  const [routeRows, setRouteRows] = useState([]);
  const [routeDone, setRouteDone] = useState(false);
  const [days, setDays] = useState(itinerary?.days || []);


  /* --------------------------------------------------
     BUILD ROUTE TABLE FROM STEP 1
  --------------------------------------------------- */
  useEffect(() => {
    const totalDays = Number(tourEntry?.days);

    if (!tourEntry?.tourStart || !totalDays) return;

    const rows = Array.from({ length: totalDays }).map((_, i) => ({
      day: i + 1,
      date: addDays(tourEntry.tourStart, i), // ✅ now works
      startCityId: i === 0 ? null : undefined,
      destinationId: null,
    }));

    setRouteRows(rows);
    setRouteDone(false);
    setDays([]);
  }, [tourEntry?.tourStart, tourEntry?.days]);

  useEffect(() => {
    dispatch(fetchCities(""));
    dispatch(fetchExcursions(""));
    dispatch(fetchStandardDescriptions(""));
  }, [dispatch]);

  /* --------------------------------------------------
     ROUTE LOGIC
  --------------------------------------------------- */
  function updateStartCity(cityId) {
    const updated = [...routeRows];
    updated[0].startCityId = cityId;
    setRouteRows(updated);
  }

  function updateDestination(index, destinationId) {
    const updated = [...routeRows];
    updated[index].destinationId = destinationId;

    if (updated[index + 1]) {
      updated[index + 1].startCityId = destinationId;
    }

    setRouteRows(updated);
  }

  const routeValid = useMemo(() => {
    return routeRows.length > 0 &&
      routeRows.every((r) => r.startCityId && r.destinationId);
  }, [routeRows]);

  function buildDayCards() {
    const built = routeRows.map((r) => ({
      day: r.day,
      date: r.date,
      startCityId: r.startCityId,
      destinationId: r.destinationId,

      stops: [],
      excursions: [],
      description: "",
      custom: false,
      notes: "",
    }));

    setDays(built);
    setRouteDone(true);
    onChange({ days: built }); // ✅ save ONLY itinerary
  }

  function updateDay(index, patch) {
    const updated = [...days];
    updated[index] = { ...updated[index], ...patch };
    setDays(updated);
    onChange({ days: updated });
  }

  return (
    <div>
      {/* ROUTE TABLE */}
      <Card>
        <div className="text-lg font-semibold mb-3">
          Tour Route & Dates
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2">Day</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Start</th>
              <th className="border p-2">Destination</th>
            </tr>
          </thead>

          <tbody>
            {routeRows.map((r, i) => (
              <tr key={i}>
                <td className="border p-2 text-center">Day {r.day}</td>
                <td className="border p-2">{r.date}</td>

                <td className="border p-2">
                  {i === 0 ? (
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={r.startCityId || ""}
                      onChange={(e) =>
                        updateStartCity(Number(e.target.value))
                      }
                    >
                      <option value="">Select start</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    cities.find((c) => c.id === r.startCityId)?.name
                  )}
                </td>

                <td className="border p-2">
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={r.destinationId || ""}
                    disabled={!r.startCityId}
                    onChange={(e) =>
                      updateDestination(i, Number(e.target.value))
                    }
                  >
                    <option value="">Select destination</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <Button disabled={!routeValid} onClick={buildDayCards}>
            Done → Build Day Cards
          </Button>
        </div>
      </Card>

      {/* DAY CARDS */}
      {routeDone && (
        <div className="mt-6 flex flex-col gap-4">
          {days.map((day, index) => (
            <DayCard
              key={index}
              day={day}
              isFirstDay={index === 0}
              prevDestinationId={
                index > 0 ? days[index - 1].destinationId : null
              }
              onUpdate={(patch) => updateDay(index, patch)}
            />
          ))}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={back}>
              ← Back
            </Button>
            <Button onClick={next}>Next →</Button>
          </div>
        </div>
      )}
    </div>
  );
}
