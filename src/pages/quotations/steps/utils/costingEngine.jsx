// Centralized calculators consumed by Step3Costing & its sections

import { calcPerPersonCost, calcSafariCost, calcBoatCost } from "../../../../utils/excursionCalc";

// ===== HOTELS =====
export function calculateHotelsCost(hotels = []) {
  // Expected hotel block item:
  // { nights, hotelId, roomCategory, mealPlan, earlyCICharge, lateCOCharge, driverAccommodation }
  // For now: price = (roomCategory.basePriceUSD * nights) + early/late + (driverAccommodation * nights)
  // NOTE: Real meal plan uplifts can be added later (HB/FB multipliers).

  let total = 0;
  const lines = hotels.map((b) => {
    const roomBase = extractPriceFromRoomLabel(b.roomCategory); // e.g. "Deluxe — $120"
    const nights = Number(b.nights || 0);
    const subtotal =
      nights * (roomBase || 0) +
      Number(b.earlyCICharge || 0) +
      Number(b.lateCOCharge || 0) +
      nights * Number(b.driverAccommodation || 0);

    total += subtotal;
    return { ...b, subtotal };
  });

  return { total, lines };
}

function extractPriceFromRoomLabel(label) {
  if (!label) return 0;
  // If label is "Deluxe — $120" or just "Deluxe", try to pick last number
  const m = String(label).match(/(\d+(\.\d+)?)/g);
  return m ? Number(m[m.length - 1]) : 0;
}

// ===== TRANSPORT =====
export function calculateTransportCost(transport = null) {
  if (!transport) return { total: 0 };

  if (transport.noTransport) {
    return {
      total: 0,
      details: { reason: "No transport selected", transferDistance: transport.transferDistance || 0 },
    };
  }

  const base = Number(transport.baseRate || 0) * Number(transport.days || 0);
  const guide = Number(transport.guideFee || 0) * Number(transport.days || 0);
  const assistant = Number(transport.assistantFee || 0) * Number(transport.days || 0);
  const bata = Number(transport.driverBata || 0);

  const total = base + guide + assistant + bata;

  return {
    total,
    details: {
      baseDays: transport.days || 0,
      distance: transport.distance || 0,
      guidePerDay: transport.guideFee || 0,
      assistantPerDay: transport.assistantFee || 0,
      driverBata: transport.driverBata || 0,
    },
  };
}

// ===== EXCURSIONS =====
export function calculateExcursionsCost(excursions = { days: [] }) {
  // excursions.days: [{ dayIndex, items:[{ excursionId, type, includeGuide, isFullDay, customPrice }]}]
  // This function returns a normalized result with totals.
  let total = 0;

  const dayLines = (excursions.days || []).map((d) => {
    const items = (d.items || []).map((it) => {
      const subtotal = Number(it.subtotal || 0);
      return { ...it, subtotal };
    });
    const dayTotal = items.reduce((s, x) => s + x.subtotal, 0);
    total += dayTotal;
    return { dayIndex: d.dayIndex, items, dayTotal };
  });

  return { total, days: dayLines };
}

// ===== MISC =====
export function calculateMiscCost({ misc = 15, margin = 25, bankCharge = 3.2, tt = false }) {
  // This function only returns config for reference; computation applied in grandTotal
  return { misc, margin, bankCharge, tt };
}

// ===== GRAND TOTAL =====
export function calculateGrandTotal({ hotels, transport, excursions, misc }) {
  const hotelsTotal = hotels?.total || 0;
  const transportTotal = transport?.total || 0;
  const excursionsTotal = excursions?.total || 0;
  const base = hotelsTotal + transportTotal + excursionsTotal + Number(misc?.misc || 0);

  // Margin
  const marginRate = Number(misc?.margin || 0) / 100;
  const afterMargin = base * (1 + marginRate);

  // Bank charges (3.2%) unless TT enabled
  const bankRate = misc?.tt ? 0 : (Number(misc?.bankCharge || 0) / 100);
  const final = afterMargin * (1 + bankRate);

  return Number(final.toFixed(2));
}
