import { useState } from "react";
import Button from "../../../components/common/Button";
import DayCard from "./DayCard";

import DestinationSelector from "./selectors/DestinationSelector";
import DuplicateStandardModal from "./modals/DuplicateStandardModal";
import DuplicateQuotationModal from "./modals/DuplicateQuotationModal";

export default function Step2Itinerary({ tourEntry, data, onChange, next, back }) {
  const [days, setDays] = useState(data.days || []);

  const [openDestinationModal, setOpenDestinationModal] = useState(null); // dayIndex
  const [openDupStd, setOpenDupStd] = useState(false);
  const [openDupQuote, setOpenDupQuote] = useState(false);

  // Sync with parent
  function updateDays(updated) {
    setDays(updated);
    onChange({ ...data, days: updated });
  }

  // Add day → immediately open destination selector
  function addDay() {
    const newDay = {
      day: days.length + 1,
      destinationId: null,
      stops: [],
      excursions: [],
      description: "",
      custom: false,
      notes: ""
    };

    const updated = [...days, newDay];
    updateDays(updated);

    // Open destination selector for this day
    setOpenDestinationModal(updated.length - 1);
  }

  // Remove day
  function removeDay(index) {
    const updated = days.filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, day: i + 1 }));
    updateDays(updated);
  }

  // Update a specific day’s fields
  function updateDay(index, patch) {
    const updated = [...days];
    updated[index] = { ...updated[index], ...patch };
    updateDays(updated);
  }

  // Duplicate standard itinerary
  function applyStandardItinerary(stdDays) {
    updateDays(stdDays);
    setOpenDupStd(false);
  }

  // Duplicate previous quotation
  function applyQuotationDuplicate(prevDays) {
    updateDays(prevDays);
    setOpenDupQuote(false);
  }

  return (
    <div>

      {/* Header buttons */}
      <div className="flex gap-3 mb-4">
        <Button onClick={addDay}>+ Add Day</Button>
        <Button variant="secondary" onClick={() => setOpenDupStd(true)}>
          Duplicate Standard Itinerary
        </Button>
        <Button variant="secondary" onClick={() => setOpenDupQuote(true)}>
          Duplicate Previous Quotation
        </Button>
      </div>

      {/* Day Cards */}
      <div className="flex flex-col gap-4">
        {days.map((day, index) => (
          <DayCard
            key={index}
            index={index}
            day={day}
            onUpdate={(patch) => updateDay(index, patch)}
            onRemove={() => removeDay(index)}
            openDestination={() => setOpenDestinationModal(index)}
          />
        ))}

        {days.length === 0 && (
          <div className="text-gray-500 border p-5 rounded text-center">
            No days added. Click <b>Add Day</b> to start.
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={back}>← Back</Button>
        <Button disabled={days.length === 0} onClick={next}>Next →</Button>
      </div>

      {/* Select Destination Modal */}
      {openDestinationModal !== null && (
        <DestinationSelector
          open={openDestinationModal !== null}
          onClose={() => setOpenDestinationModal(null)}
          onSelect={(cityId) => {
            updateDay(openDestinationModal, { destinationId: cityId });
            setOpenDestinationModal(null);
          }}
        />
      )}

      {/* Duplicate Standard */}
      {openDupStd && (
        <DuplicateStandardModal
          open={openDupStd}
          onClose={() => setOpenDupStd(false)}
          onApply={applyStandardItinerary}
        />
      )}

      {/* Duplicate Previous Quotation */}
      {openDupQuote && (
        <DuplicateQuotationModal
          open={openDupQuote}
          onClose={() => setOpenDupQuote(false)}
          onApply={applyQuotationDuplicate}
        />
      )}
    </div>
  );
}
