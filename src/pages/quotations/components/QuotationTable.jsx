import QuotationRowActions from "./QuotationRowActions";

export default function QuotationTable({
  data,
  openQuotation,
  duplicateQuotation
}) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2 border">Tour No</th>
          <th className="p-2 border">Guest</th>
          <th className="p-2 border">Dates</th>
          <th className="p-2 border">Pax</th>
          <th className="p-2 border">Executive</th>
          <th className="p-2 border text-right">Total (USD)</th>
          <th className="p-2 border"></th>
        </tr>
      </thead>

      <tbody>
        {data.map((qt) => (
          <tr key={qt.id} className="hover:bg-gray-50">
            <td className="p-2 border">{qt.tourNumber}</td>
            <td className="p-2 border">{qt.guestName}</td>
            <td className="p-2 border">
              {qt.tourStart} → {qt.tourEnd}
            </td>
            <td className="p-2 border">
              {qt.adults + qt.children.length}
            </td>
            <td className="p-2 border">
              {qt.executiveName || "—"}
            </td>
            <td className="p-2 border text-right">
              ${qt.grandTotal?.toFixed(2)}
            </td>

            <td className="p-2 border text-right">
              <QuotationRowActions
                quotation={qt}
                openQuotation={() => openQuotation(qt)}
                duplicateQuotation={() => duplicateQuotation(qt)}
              />
            </td>
          </tr>
        ))}

        {data.length === 0 && (
          <tr>
            <td colSpan="7" className="p-4 text-center text-gray-500">
              No quotations found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
