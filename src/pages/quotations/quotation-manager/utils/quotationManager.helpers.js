export function flattenTree(tree) {
  return tree.flatMap((yearNode) =>
    yearNode.months.flatMap((monthNode) =>
      monthNode.quotations.map((q) => ({
        ...q,
        year: yearNode.year,
        month: monthNode.month,
        monthKey: monthNode.key,
      }))
    )
  );
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case "CONFIRMED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "CANCELLED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "DRAFT":
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

export function formatMoney(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function getStats(items) {
  return {
    total: items.length,
    confirmed: items.filter((i) => i.status === "CONFIRMED").length,
    pending: items.filter((i) => i.status === "PENDING").length,
    cancelled: items.filter((i) => i.status === "CANCELLED").length,
  };
}

export function filterItems(items, search, statusFilter) {
  let result = [...items];

  if (statusFilter && statusFilter !== "ALL") {
    result = result.filter((item) => item.status === statusFilter);
  }

  const q = search.trim().toLowerCase();
  if (q) {
    result = result.filter((item) => {
      const haystack = [
        item.quote_no,
        item.customer_name,
        item.company,
        item.start_city,
        item.end_city,
        item.status,
        item.month,
        item.year,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }

  return result.sort((a, b) => {
    if (a.updated_at > b.updated_at) return -1;
    if (a.updated_at < b.updated_at) return 1;
    return b.id - a.id;
  });
}

export function getMonthNodeByKey(tree, monthKey) {
  for (const year of tree) {
    for (const month of year.months) {
      if (month.key === monthKey) {
        return {
          ...month,
          year: year.year,
          quotations: month.quotations.map((q) => ({
            ...q,
            year: year.year,
            month: month.month,
            monthKey: month.key,
          })),
        };
      }
    }
  }
  return null;
}

export function getYearNode(tree, yearValue) {
  return tree.find((item) => item.year === Number(yearValue)) || null;
}