import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const initialState = {
  items: [],            // all quotations (mock-persisted in localStorage)
  currentDraft: null,   // quotation being edited
};

const slice = createSlice({
  name: "quotations",
  initialState,
  reducers: {
    setQuotations: (s, a) => { s.items = a.payload; },
    startNewQuotation: (s) => {
      s.currentDraft = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        tourNumber: `TI-${Date.now().toString().slice(-6)}`,
        status: "Pending",

        // Step 1
        tourEntry: {
          guestName: "",
          email: "",
          tourStart: "",
          tourEnd: "",
          adults: 0,
          children: [],          // store ages here
          tourType: "",
          exchangeRate: 320,
        },

        // Step 2
        itinerary: { days: [] },

        // Step 3
        costing: {
          hotels: [],
          transport: null,
          excursions: { days: [], total: 0 },
          misc: { misc: 15, margin: 25, bankCharge: 3.2, tt: false },
          grandTotal: 0,
        },

        // Step 4
        finalDoc: {
          title: "Your Sri Lanka Holiday",
          subtitle: "Crafted by Travellers Isle",
          coverImage: "",
          gallery: [],
          highlightText: "",
          dayDescriptions: [],
          supplements: [],
          offers: { enabled: false, offerPrice: 0, isB2B: false },
        },
      };
    },
    loadQuotation: (s, a) => { s.currentDraft = a.payload || null; },
    saveDraftStep: (s, a) => { s.currentDraft = { ...s.currentDraft, ...a.payload }; },
    saveCompletedQuotation: (s) => {
      const idx = s.items.findIndex(q => q.id === s.currentDraft.id);
      if (idx >= 0) s.items[idx] = s.currentDraft; else s.items.push(s.currentDraft);
    },
    duplicateIntoDraft: (s, a) => {
      const q = a.payload;
      s.currentDraft = {
        ...q,
        id: nanoid(),
        tourNumber: `${q.tourNumber}-COPY`,
        createdAt: new Date().toISOString(),
        status: "Pending",
      };
    },
  },
});

export const {
  setQuotations,
  startNewQuotation,
  loadQuotation,
  saveDraftStep,
  saveCompletedQuotation,
  duplicateIntoDraft,
} = slice.actions;

export default slice.reducer;
