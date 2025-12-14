import { useState, useEffect } from "react";
import Step1TourEntry from "./steps/Step1TourEntry";
import Step2Itinerary from "./steps/Step2Itinerary";
import Step3Costing from "./steps/Step3Costing";
import Step4Finalize from "./steps/Step4Finalize";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

export default function QuotationEditor() {
  // Wizard step
  const [step, setStep] = useState(1);

  // Main Quotation State
  const [tourEntry, setTourEntry] = useState({
    guestName: "",
    email: "",
    tourStart: "",
    tourEnd: "",
    adults: 2,
    children: [],
    tourType: "",
    exchangeRate: 320,
    tourNumber: "",
    submissionDate: "",
  });

  const [itinerary, setItinerary] = useState({
    days: []  // { day:1, cityId:3, excursions:[1,2], notes:"", customDescription:"" }
  });

  const [costing, setCosting] = useState({
    hotels: [],
    transport: null,
    excursions: [],
    misc: 15,
    margin: 25,
    bankCharge: 3.2,
    tt: false,
    options: [] // multi-option support later
  });

  const [finalData, setFinalData] = useState({
    inclusions: "",
    exclusions: "",
    images: [],
    supplements: [],
  });

  // Auto-generate tour number & submission date on first load
  useEffect(() => {
    setTourEntry((prev) => ({
      ...prev,
      tourNumber: "T" + Date.now().toString().slice(-6),
      submissionDate: new Date().toISOString().slice(0, 10),
    }));
  }, []);

  function next() {
    if (step < 4) setStep(step + 1);
  }
  function back() {
    if (step > 1) setStep(step - 1);
  }

  const stepTitles = {
    1: "Tour Entry",
    2: "Itinerary Builder",
    3: "Tour Costing",
    4: "Finalize & Export",
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{stepTitles[step]}</h2>

      <Card>
        {step === 1 && (
          <Step1TourEntry
            data={tourEntry}
            onChange={setTourEntry}
            next={next}
          />
        )}

        {step === 2 && (
          <Step2Itinerary
            tourEntry={tourEntry}
            data={itinerary}
            onChange={setItinerary}
            next={next}
            back={back}
          />
        )}

        {step === 3 && (
          <Step3Costing
            tourEntry={tourEntry}
            itinerary={itinerary}
            data={costing}
            onChange={setCosting}
            next={next}
            back={back}
          />
        )}

        {step === 4 && (
          <Step4Finalize
            tourEntry={tourEntry}
            itinerary={itinerary}
            costing={costing}
            data={finalData}
            onChange={setFinalData}
            back={back}
          />
        )}
      </Card>
    </div>
  );
}
