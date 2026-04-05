export function roundMoney(value) {
  return Number((Number(value || 0)).toFixed(2));
}

export function calcMarginPercent(cost, margin) {
  if (!cost || cost <= 0) return 0;
  return roundMoney((margin / cost) * 100);
}

export function calculateRoomPricing(room) {
  const quantity = Number(room.quantity || 0);
  const nights = Number(room.nights || 0);

  const pricingMode = room.pricing_mode || "PER_NIGHT";

  const baseCost = Number(room.base_cost || 0);
  const baseSell = Number(room.base_sell || 0);

  const mealSupplementCost = Number(room.meal_supplement_cost || 0);
  const mealSupplementSell = Number(room.meal_supplement_sell || 0);

  const extraCost = Number(room.extra_cost || 0);
  const extraSell = Number(room.extra_sell || 0);

  const taxPercent = Number(room.tax_percent || 0);
  const serviceChargePercent = Number(room.service_charge_percent || 0);

  const unitCost =
    baseCost + mealSupplementCost + extraCost;

  const unitSell =
    baseSell + mealSupplementSell + extraSell;

  const multiplier =
    pricingMode === "PER_NIGHT"
      ? quantity * nights
      : quantity;

  const roomCostTotal = roundMoney(unitCost * multiplier);
  const roomSellTotal = roundMoney(unitSell * multiplier);

  const taxCostTotal = roundMoney(roomCostTotal * (taxPercent / 100));
  const taxSellTotal = roundMoney(roomSellTotal * (taxPercent / 100));

  const serviceCostTotal = roundMoney(
    roomCostTotal * (serviceChargePercent / 100)
  );
  const serviceSellTotal = roundMoney(
    roomSellTotal * (serviceChargePercent / 100)
  );

  const totalCost = roundMoney(
    roomCostTotal + taxCostTotal + serviceCostTotal
  );
  const totalSell = roundMoney(
    roomSellTotal + taxSellTotal + serviceSellTotal
  );

  const margin = roundMoney(totalSell - totalCost);
  const marginPercent = calcMarginPercent(totalCost, margin);

  return {
    ...room,
    pricing: {
      room_cost_total: roomCostTotal,
      room_sell_total: roomSellTotal,
      tax_cost_total: taxCostTotal,
      tax_sell_total: taxSellTotal,
      service_cost_total: serviceCostTotal,
      service_sell_total: serviceSellTotal,
      total_cost: totalCost,
      total_sell: totalSell,
      margin,
      margin_percent: marginPercent,
    },
  };
}

export function calculateHotelPricing(hotel) {
  const rooms = (hotel.rooms || []).map(calculateRoomPricing);

  const totals = rooms.reduce(
    (acc, room) => {
      acc.total_cost += Number(room.pricing?.total_cost || 0);
      acc.total_sell += Number(room.pricing?.total_sell || 0);
      acc.margin += Number(room.pricing?.margin || 0);
      return acc;
    },
    {
      total_cost: 0,
      total_sell: 0,
      margin: 0,
    }
  );

  const rounded = {
    total_cost: roundMoney(totals.total_cost),
    total_sell: roundMoney(totals.total_sell),
    margin: roundMoney(totals.margin),
  };

  return {
    ...hotel,
    rooms,
    pricing: {
      ...rounded,
      margin_percent: calcMarginPercent(
        rounded.total_cost,
        rounded.margin
      ),
    },
  };
}

export function calculateAccommodationPricing(accommodation) {
  if (!accommodation || accommodation.bookedByCustomer) {
    return {
      ...accommodation,
      hotels: accommodation?.hotels || [],
      pricing: {
        total_cost: 0,
        total_sell: 0,
        margin: 0,
        margin_percent: 0,
      },
    };
  }

  const hotels = (accommodation.hotels || []).map(calculateHotelPricing);

  const totals = hotels.reduce(
    (acc, hotel) => {
      acc.total_cost += Number(hotel.pricing?.total_cost || 0);
      acc.total_sell += Number(hotel.pricing?.total_sell || 0);
      acc.margin += Number(hotel.pricing?.margin || 0);
      return acc;
    },
    {
      total_cost: 0,
      total_sell: 0,
      margin: 0,
    }
  );

  const rounded = {
    total_cost: roundMoney(totals.total_cost),
    total_sell: roundMoney(totals.total_sell),
    margin: roundMoney(totals.margin),
  };

  return {
    ...accommodation,
    hotels,
    pricing: {
      ...rounded,
      margin_percent: calcMarginPercent(
        rounded.total_cost,
        rounded.margin
      ),
    },
  };
}

export function calculateDayAccommodation(day) {
  return {
    ...day,
    accommodation: calculateAccommodationPricing(day.accommodation),
  };
}

export function calculateQuotationAccommodation(days = []) {
  const calculatedDays = days.map(calculateDayAccommodation);

  const totals = calculatedDays.reduce(
    (acc, day) => {
      const pricing = day.accommodation?.pricing || {};
      acc.total_cost += Number(pricing.total_cost || 0);
      acc.total_sell += Number(pricing.total_sell || 0);
      acc.margin += Number(pricing.margin || 0);
      return acc;
    },
    {
      total_cost: 0,
      total_sell: 0,
      margin: 0,
    }
  );

  const rounded = {
    total_cost: roundMoney(totals.total_cost),
    total_sell: roundMoney(totals.total_sell),
    margin: roundMoney(totals.margin),
  };

  return {
    days: calculatedDays,
    summary: {
      ...rounded,
      margin_percent: calcMarginPercent(
        rounded.total_cost,
        rounded.margin
      ),
    },
  };
}


export function createEmptyRoom(nights = 1) {
  return {
    id: crypto.randomUUID(),
    room_category_id: "",
    room_category_name: "",
    meal_plan: "BB",

    quantity: 1,
    nights,

    pricing_mode: "PER_NIGHT",

    base_cost: 0,
    base_sell: 0,

    meal_supplement_cost: 0,
    meal_supplement_sell: 0,

    extra_cost: 0,
    extra_sell: 0,

    tax_percent: 0,
    service_charge_percent: 0,

    pricing: {
      room_cost_total: 0,
      room_sell_total: 0,
      tax_cost_total: 0,
      tax_sell_total: 0,
      service_cost_total: 0,
      service_sell_total: 0,
      total_cost: 0,
      total_sell: 0,
      margin: 0,
      margin_percent: 0,
    },
  };
}