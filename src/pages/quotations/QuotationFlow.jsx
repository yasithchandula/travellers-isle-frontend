import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  startNewQuotation,
  loadQuotation,
  saveDraftStep,
  saveCompletedQuotation,
} from "../../app/slices/quotationSlice";
import { quotationApi } from "../../api/quotationApi";

// your current files (as in your screenshot)
import Step1TourEntry from "./steps/Step1TourEntry.jsx";
import Step2Itinerary from "./steps/Step2Itinerary.jsx";
import Step3Costing from "./steps/Step3Costing.jsx";
import Step4Editor from "./steps/Step4Editor.jsx";
import Step4Supplements from "./steps/Step4Supplements.jsx";
import Step4Offers from "./steps/Step4Offers.jsx";
import Step4Preview from "./steps/Step4Preview.jsx";

export default function QuotationFlow({ mode = "new" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const draft = useSelector(s => s.quotations.currentDraft);
  const [step, setStep] = useState(1);

  useEffect(() => {
    (async () => {
      if (mode === "new") {
        dispatch(startNewQuotation());
      } else {
        const q = await quotationApi.getById(id);
        dispatch(loadQuotation(q));
      }
    })();
  }, [mode, id, dispatch]);

  if (!draft) return <div className="p-6">Loading…</div>;

  const goNext = () => setStep(s => s + 1);
  const goBack = () => setStep(s => Math.max(1, s - 1));
  const saveStep = (patch) => dispatch(saveDraftStep(patch));

  async function finish() {
    dispatch(saveCompletedQuotation());
    await quotationApi.saveOne(useSelector(s => s.quotations.currentDraft) || draft);
    navigate("/quotations");
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {step === 1 && (
        <Step1TourEntry
          data={draft.tourEntry}
          onChange={(v) => saveStep({ tourEntry: v })}
          next={goNext}
        />
      )}

      {step === 2 && (
        <Step2Itinerary
          tourEntry={draft.tourEntry} 
          itinerary={draft.itinerary}      
          onChange={(v) => saveStep({ itinerary: v })}
          back={goBack}
          next={goNext}
        />

      )}

      {step === 3 && (
        <Step3Costing
          data={draft.costing}
          tourEntry={draft.tourEntry}
          itinerary={draft.itinerary}
          onChange={(v) => saveStep({ costing: v })}
          back={goBack}
          next={goNext}
        />
      )}

      {step === 4 && (
        <Step4Editor
          itinerary={draft.itinerary}
          tourEntry={draft.tourEntry}
          costing={draft.costing}
          finalDoc={draft.finalDoc}
          onChange={(v) => saveStep({ finalDoc: v })}
          back={goBack}
          next={goNext}
        />
      )}

      {step === 5 && (
        <Step4Supplements
          finalDoc={draft.finalDoc}
          onChange={(v) => saveStep({ finalDoc: v })}
          back={goBack}
          next={goNext}
        />
      )}

      {step === 6 && (
        <Step4Offers
          finalDoc={draft.finalDoc}
          costing={draft.costing}
          onChange={(v) => saveStep({ finalDoc: v })}
          back={goBack}
          next={goNext}
        />
      )}

      {step === 7 && (
        <Step4Preview
          itinerary={draft.itinerary}
          finalDoc={draft.finalDoc}
          costing={draft.costing}
          back={goBack}
        />
      )}

      {step === 8 && (
        <div className="p-6">
          <div className="text-xl font-semibold mb-3">All done!</div>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={finish}>
            Save & Finish
          </button>
        </div>
      )}
    </div>
  );
}
