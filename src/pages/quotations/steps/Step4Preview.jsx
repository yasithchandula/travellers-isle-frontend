import { useState } from "react";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import OTPModal from "../../../components/common/OTPModal";
import html2pdf from "html2pdf.js";

import QuotationRender from "./sections/QuotationRender";

export default function Step4Preview({
  itinerary,
  finalDoc,
  costing,
  back,
}) {
  const [otpOpen, setOtpOpen] = useState(false);

  function handleDownload() {
    setOtpOpen(true);
  }

  function executeDownload() {
    setOtpOpen(false);

    const element = document.getElementById("quotation-preview-content");

    const opt = {
      margin: 0.5,
      filename: "travellers-isle-quotation.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4" },
    };

    html2pdf().set(opt).from(element).save();
  }

  function downloadWord() {
    const htmlContent = document.getElementById("quotation-preview-content").innerHTML;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'></head><body>
    `;

    const footer = "</body></html>";

    const blob = new Blob([header + htmlContent + footer], {
      type: "application/msword",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotation.doc";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Final Preview</h2>

        <div
          id="quotation-preview-content"
          className="p-6 bg-white rounded shadow max-w-3xl mx-auto"
          style={{ color: "#333", fontFamily: "Inter, sans-serif" }}
        >
          <QuotationRender
            itinerary={itinerary}
            finalDoc={finalDoc}
            costing={costing}
          />
        </div>
      </Card>

      {/* ACTION BUTTONS */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={back}>← Back</Button>

        <div className="flex gap-4">
          {/* Word export only if B2B */}
          {finalDoc?.offers?.isB2B && (
            <Button onClick={downloadWord}>
              Download Word (B2B)
            </Button>
          )}

          <Button variant="primary" onClick={handleDownload}>
            Download PDF
          </Button>
        </div>
      </div>

      <OTPModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={executeDownload}
      />
    </div>
  );
}
