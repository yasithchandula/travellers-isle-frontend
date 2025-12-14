import { useState, useEffect } from "react";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";

import CostHotels from "./sections/CostHotels";
import CostTransport from "./sections/CostTransport";
import CostExcursions from "./sections/CostExcursions";
import CostMisc from "./sections/CostMisc";
import CostSummary from "./sections/CostSummary";

import {
  calculateHotelsCost,
  calculateTransportCost,
  calculateExcursionsCost,
  calculateMiscCost,
  calculateGrandTotal,
} from "./utils/costingEngine";

export default function Step3Costing({
  tourEntry,
  itinerary,
  data,
  onChange,
  next,
  back,
}) {
  const [costState, setCostState] = useState(data);

  // Recalculate total cost whenever costState changes
  useEffect(() => {
    const hotels = calculateHotelsCost(costState.hotels);
    const transport = calculateTransportCost(costState.transport);
    const excursions = calculateExcursionsCost(costState.excursions);
    const misc = calculateMiscCost({
      misc: costState.misc,
      margin: costState.margin,
      bankCharge: costState.bankCharge,
      tt: costState.tt,
    });

    const grand = calculateGrandTotal({
      hotels,
      transport,
      excursions,
      misc,
    });

    onChange({
      ...costState,
      hotels,
      transport,
      excursions,
      misc,
      grandTotal: grand,
    });
  }, [costState]);

  function updateSection(section, value) {
    setCostState({
      ...costState,
      [section]: value,
    });
  }

  return (
    <div>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Accommodation Cost</h2>
        <CostHotels
          itinerary={itinerary}
          hotels={costState.hotels}
          setHotels={(v) => updateSection("hotels", v)}
        />
      </Card>

      <Card className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Transport Cost</h2>
        <CostTransport
          tourEntry={tourEntry}
          transport={costState.transport}
          setTransport={(v) => updateSection("transport", v)}
        />
      </Card>

      <Card className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Excursions Cost</h2>
        <CostExcursions
          itinerary={itinerary}
          excursions={costState.excursions}
          setExcursions={(v) => updateSection("excursions", v)}
        />
      </Card>

      <Card className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Misc, Margin & Bank</h2>
        <CostMisc
          misc={costState.misc}
          margin={costState.margin}
          bankCharge={costState.bankCharge}
          tt={costState.tt}
          onChange={(patch) => updateSection("misc", patch)}
        />
      </Card>

      <Card className="mt-4">
        <CostSummary data={costState} />
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={back}>
          ← Back
        </Button>
        <Button onClick={next}>Next →</Button>
      </div>
    </div>
  );
}
