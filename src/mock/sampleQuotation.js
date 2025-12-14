export default {
  // Step 1 — tour entry
  guestName: "",
  tourStart: "",
  tourEnd: "",
  adults: 2,
  children: [],

  // Step 2 — itinerary
  itinerary: [],

  // Step 3 — costing
  costing: {
    accommodation: [],
    transport: {},
    excursions: [],
    misc: 15,
    margin: 25,
    bank: 3.2,
    grandTotal: 0,
  },

  // Step 4 — final
  finalDoc: {
    title: "Your Sri Lanka Holiday",
    subtitle: "",
    coverImage: "",
    highlightText: "",
    dayDescriptions: [],
    supplements: [],
    offers: {
      enabled: false,
      offerPrice: 0,
      offerTitle: "",
      expiryDate: "",
      note: "",
      isB2B: false,
    },
  },

  status: "Pending",
  executiveId: "",
  executiveName: "",
};
