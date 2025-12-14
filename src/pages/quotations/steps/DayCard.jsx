import { useMemo, useState, useEffect } from "react";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import DestinationSelector from "./selectors/DestinationSelector";
import StopSelector from "./selectors/StopSelector";
import ExcursionSelector from "./selectors/ExcursionSelector";
import DescriptionEditor from "./editor/DescriptionEditor";
import { useSelector } from "react-redux";

export default function DayCard({ index, day, onUpdate, onRemove, openDestination }) {
  const cities = useSelector((s) => s.cities.items);
  const excursions = useSelector((s) => s.excursions.items);

  // Local UI modals
  const [stopModal, setStopModal] = useState(false);
  const [excModal, setExcModal] = useState(false);

  // Set/track an "autoDescription" baseline so we can flag customs
  const autoDescription = useMemo(() => {
    // SUPER simple placeholder logic for now.
    // Later: replace with StandardDescriptionAutoFill using start->dest->stops->excursions.
    const cityName = cities.find((c) => c.id === day.destinationId)?.name || "Destination";
    const stopNames = (day.stops || [])
      .map((id) => cities.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    const exNames = (day.excursions || [])
      .map((id) => excursions.find((e) => e.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    return `
      <h3>Day ${day.day}: ${cityName}</h3>
      ${stopNames ? `<p><strong>Stops:</strong> ${stopNames}</p>` : ""}
      ${exNames ? `<p><strong>Planned experiences:</strong> ${exNames}</p>` : ""}
      <p>Scenic transfers and curated activities as per plan.</p>
    `.trim();
  }, [day.day, day.destinationId, day.stops, day.excursions, cities, excursions]);

  // Initialize description once if empty
  useEffect(() => {
    if (!day.description) {
      onUpdate({ description: autoDescription, custom: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flag custom automatically
  useEffect(() => {
    if (day.description) {
      const normalizedA = normalizeHTML(autoDescription);
      const normalizedD = normalizeHTML(day.description);
      onUpdate({ custom: normalizedD !== normalizedA });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDescription]);

  const destinationName =
    cities.find((c) => c.id === day.destinationId)?.name || "Select destination";

  function updateStops(ids) {
    onUpdate({ stops: ids });
  }

  function updateExcursions(ids) {
    onUpdate({ excursions: ids });
  }

  function updateDescription(html) {
    onUpdate({ description: html });
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">DAY {day.day}</div>
          {day.custom && (
            <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">
              Custom
            </span>
          )}
        </div>
        <Button variant="danger" onClick={onRemove}>Delete Day</Button>
      </div>

      {/* Destination */}
      <div className="mb-4">
        <div className="text-sm font-semibold mb-1">Destination</div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 border rounded bg-white">{destinationName}</div>
          <Button variant="secondary" onClick={openDestination}>Change</Button>
        </div>
      </div>

      {/* Stops */}
      <div className="mb-4">
        <div className="text-sm font-semibold mb-1">Stops</div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {(day.stops || []).length ? (
              day.stops.map((id) => {
                const name = cities.find((c) => c.id === id)?.name || id;
                return (
                  <span key={id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {name}
                  </span>
                );
              })
            ) : (
              <span className="text-gray-500">No stops added</span>
            )}
          </div>
          <Button variant="secondary" onClick={() => setStopModal(true)}>Edit</Button>
        </div>
      </div>

      {/* Excursions */}
      <div className="mb-4">
        <div className="text-sm font-semibold mb-1">Excursions</div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {(day.excursions || []).length ? (
              day.excursions.map((id) => {
                const name = excursions.find((e) => e.id === id)?.name || id;
                return (
                  <span key={id} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                    {name}
                  </span>
                );
              })
            ) : (
              <span className="text-gray-500">No excursions added</span>
            )}
          </div>
          <Button variant="secondary" onClick={() => setExcModal(true)}>Edit</Button>
        </div>
      </div>

      {/* Description (TipTap) */}
      <div className="mb-4">
        <div className="text-sm font-semibold mb-2">Description</div>
        <DescriptionEditor
          initialHTML={day.description || autoDescription}
          onChange={updateDescription}
        />
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            onClick={() => updateDescription(autoDescription)}
            type="button"
          >
            Reset to Standard
          </Button>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-2">
        <div className="text-sm font-semibold mb-1">Notes (optional)</div>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Internal note for this day…"
          value={day.notes || ""}
          onChange={(e) => onUpdate({ notes: e.target.value })}
        />
      </div>

      {/* Stop selector modal */}
      {stopModal && (
        <StopSelector
          open={stopModal}
          onClose={() => setStopModal(false)}
          selected={day.stops || []}
          onApply={(ids) => {
            updateStops(ids);
            setStopModal(false);
          }}
        />
      )}

      {/* Excursion selector modal */}
      {excModal && (
        <ExcursionSelector
          open={excModal}
          onClose={() => setExcModal(false)}
          selected={day.excursions || []}
          onApply={(ids) => {
            updateExcursions(ids);
            setExcModal(false);
          }}
          limitToCityId={day.destinationId || null}
        />
      )}
    </Card>
  );
}

function normalizeHTML(html) {
  return (html || "")
    .replace(/\s+/g, " ")
    .replace(/> </g, "><")
    .trim();
}
