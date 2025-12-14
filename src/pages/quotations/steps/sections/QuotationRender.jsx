export default function QuotationRender({ itinerary, finalDoc, costing }) {

  const grand = costing.grandTotal || 0;
  const offerEnabled = finalDoc?.offers?.enabled;
  const offerPrice = finalDoc?.offers?.offerPrice;
  const isB2B = finalDoc?.offers?.isB2B;

  return (
    <div className="text-[14px] leading-relaxed">

      {/* HEADER */}
      {!isB2B && (
        <div className="mb-6 text-center">
          <img
            src="/logo.png"
            className="h-16 mx-auto mb-3"
            alt="Travellers Isle"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold text-center">{finalDoc.title}</h1>
      <h2 className="text-lg text-gray-600 text-center mb-4">
        {finalDoc.subtitle}
      </h2>

      {/* COVER IMAGE */}
      {finalDoc.coverImage && (
        <img
          src={finalDoc.coverImage}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}

      {/* HIGHLIGHT */}
      <div
        className="prose mb-6"
        dangerouslySetInnerHTML={{ __html: finalDoc.highlightText }}
      />

      {/* DAY BY DAY */}
      <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>

      {finalDoc.dayDescriptions.map((d, i) => (
        <div key={i} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{d.customTitle}</h3>
          <div className="prose"
            dangerouslySetInnerHTML={{ __html: d.customDescription }}
          />
        </div>
      ))}

      {/* OPTIONAL SUPPLEMENTS */}
      {finalDoc.supplements?.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Optional Supplements</h2>

          {finalDoc.supplements.map((s, i) => (
            <div key={i} className="mb-3 flex justify-between">
              <div>
                <div className="font-medium">{s.title}</div>
                {s.notes && (
                  <div className="text-gray-600 text-sm">{s.notes}</div>
                )}
              </div>
              <div className="font-semibold">${s.price.toFixed(2)}</div>
            </div>
          ))}
        </>
      )}

      {/* TOTALS */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Pricing Summary</h2>

      <div className="border rounded p-4 bg-gray-50">
        {!offerEnabled ? (
          <div className="text-xl font-bold">
            Grand Total: ${grand.toFixed(2)}
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-600">
              Regular Price: ${grand.toFixed(2)}
            </div>
            <div className="text-xl font-bold">
              Special Offer: ${offerPrice.toFixed(2)}
            </div>
            <div className="text-green-700 font-medium">
              You Save: ${(grand - offerPrice).toFixed(2)}
            </div>
          </>
        )}
      </div>

      {/* B2B FOOTER */}
      {isB2B ? (
        <div className="text-center text-gray-500 text-xs mt-10">
          *Prepared for B2B client. No branding included.
        </div>
      ) : (
        <div className="text-center text-gray-500 text-xs mt-10">
          Thank you for choosing Travellers Isle.<br />
          www.travellersisle.com • info@travellersisle.com
        </div>
      )}

    </div>
  );
}
