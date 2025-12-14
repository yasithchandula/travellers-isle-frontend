// Generic helpers to be reused inside Quotation Builder

export function calcPerPersonCost(cfg, counts, includeGuide = true) {
  // cfg: { infantRange, childRange, adultFrom, infantUSD, childUSD, adultUSD, guideFeeUSD }
  // counts: { infants, children, adults }
  if (!cfg || !counts) return 0;
  const base =
    (counts.infants || 0) * (cfg.infantUSD || 0) +
    (counts.children || 0) * (cfg.childUSD || 0) +
    (counts.adults || 0) * (cfg.adultUSD || 0);
  const guide = includeGuide ? (cfg.guideFeeUSD || 0) : 0;
  return base + guide;
}

export function calcSafariCost(cfg, counts, isFullDay = false) {
  // cfg: { jeepRentUSD, perPersonEntranceUSD, jeepEntranceUSD, vatRate, jeepCapacity, fullDayAvailable, lunchPerPersonUSD }
  // counts: { totalGuests }
  if (!cfg || !counts) return 0;
  const guests = counts.totalGuests || 0;
  const capacity = cfg.jeepCapacity || 6;
  const jeeps = Math.ceil(guests / capacity) || 1;

  // Entrance + jeep entrance (VAT applies to entrance items)
  const entrance = guests * (cfg.perPersonEntranceUSD || 0);
  const jeepEntrance = jeeps * (cfg.jeepEntranceUSD || 0);
  const vatMultiplier = 1 + (cfg.vatRate || 0);
  const taxed = (entrance + jeepEntrance) * vatMultiplier;

  // Jeep rentals
  let jeepRent = jeeps * (cfg.jeepRentUSD || 0);

  // Full day option
  if (isFullDay && cfg.fullDayAvailable) {
    jeepRent = jeeps * (2 * (cfg.jeepRentUSD || 0));
  }

  const lunch = isFullDay && cfg.fullDayAvailable ? (cfg.lunchPerPersonUSD || 0) * guests : 0;

  return taxed + jeepRent + lunch;
}

export function calcBoatCost(cfg, counts, includeGuide = true) {
  // cfg: { boatCapacity, boatPriceUSD, guideFeeUSD }
  // counts: { totalGuests }
  if (!cfg || !counts) return 0;
  const guests = counts.totalGuests || 0;
  const capacity = cfg.boatCapacity || 6;
  const boats = Math.ceil(guests / capacity) || 1;
  const base = boats * (cfg.boatPriceUSD || 0);
  const guide = includeGuide ? (cfg.guideFeeUSD || 0) : 0;
  return base + guide;
}
