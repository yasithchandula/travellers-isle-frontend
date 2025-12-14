export default function CostSummary({ data }) {
  const hotels = data?.hotels?.total || 0;
  const transport = data?.transport?.total || 0;
  const excursions = data?.excursions?.total || 0;
  const misc = data?.misc?.misc || 0;

  const base = hotels + transport + excursions + misc;

  const marginRate = Number(data?.misc?.margin || 0) / 100;
  const marginAmount = base * marginRate;
  const afterMargin = base + marginAmount;

  const bankRate = data?.misc?.tt ? 0 : (Number(data?.misc?.bankCharge || 0) / 100);
  const bankAmount = afterMargin * bankRate;

  const final = afterMargin + bankAmount;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>

      {/* GRID */}
      <div className="flex flex-col gap-2 text-sm">

        <Row label="Accommodation" value={hotels} />
        <Row label="Transport" value={transport} />
        <Row label="Excursions" value={excursions} />
        <Row label="Misc" value={misc} />

        <Divider />

        <Row label="Base Total" value={base} bold />

        <Row label={`Margin (${data?.misc?.margin || 0}%)`} value={marginAmount} />
        <Row label="After Margin" value={afterMargin} bold />

        {!data?.misc?.tt && (
          <Row
            label={`Bank Charge (${data?.misc?.bankCharge || 0}%)`}
            value={bankAmount}
          />
        )}

        <Divider />

        <Row label="GRAND TOTAL (USD)" value={final} big bold />

      </div>
    </div>
  );
}

function Row({ label, value, bold = false, big = false }) {
  return (
    <div className={`flex justify-between ${big ? "text-lg" : ""}`}>
      <div className={`${bold ? "font-semibold" : ""}`}>{label}</div>
      <div className={`${bold ? "font-semibold" : ""}`}>
        ${Number(value || 0).toFixed(2)}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="border-t my-2"></div>;
}
