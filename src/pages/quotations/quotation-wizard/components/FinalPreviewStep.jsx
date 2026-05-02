import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Loader2,
  Eye,
  RefreshCw,
  Monitor,
  FileText,
} from "lucide-react";

import { fetchQuotationPreviewHtml, generateQuotationPdf } from "../../../../app/slices/quotationSlice";

export default function FinalPreviewStep({ quotationId }) {
  const dispatch = useDispatch();

  const { previewHtml, loading, error, pdfLoading } = useSelector(
    (state) => state.quotations
  );

  /** =========================
   * FETCH PREVIEW
   ========================== */
  useEffect(() => {
    if (!quotationId) return;

    dispatch(fetchQuotationPreviewHtml(quotationId));
  }, [quotationId]);

  const reload = () => {
    if (!quotationId) return;
    dispatch(fetchQuotationPreviewHtml(quotationId));
  };

  /** =========================
   * SAFE HTML
   ========================== */
  const safeHtml =
    typeof previewHtml === "string"
      ? previewHtml
      : previewHtml?.data || "";

  const handleExportPdf = async () => {
    if (!quotationId) return;

    try {
      const res = await dispatch(
        generateQuotationPdf(quotationId)
      ).unwrap();

      const filePath = res?.data?.path;

      if (!filePath) {
        throw new Error("No PDF path returned");
      }

      const fileUrl = `${window.location.origin}/${filePath.replace("./", "")}`;

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `quotation_${quotationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================
       * HEADER BAR
       ========================== */}
      <Card className="border-border/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">
                Quotation Preview
              </div>
              <div className="text-xs text-muted-foreground">
                Final client-facing proposal
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reload}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            <Button
              size="sm"
              onClick={handleExportPdf}
              disabled={pdfLoading}
            >
              {pdfLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              {pdfLoading ? "Generating..." : "Export PDF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* =========================
       * PREVIEW CONTAINER
       ========================== */}
      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="border-b bg-muted/20 flex justify-between items-center">
          <div>
            <CardTitle className="text-base">
              Document Preview
            </CardTitle>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Monitor className="w-4 h-4" />
            Desktop View
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* =========================
           * LOADING
           ========================== */}
          {loading && (
            <div className="h-[650px] flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* =========================
           * ERROR
           ========================== */}
          {!loading && error && (
            <div className="h-[650px] flex flex-col items-center justify-center gap-3">
              <div className="text-sm text-red-500">
                Failed to load preview
              </div>
              <Button variant="outline" size="sm" onClick={reload}>
                Retry
              </Button>
            </div>
          )}

          {/* =========================
           * SUCCESS (BEST VIEW)
           ========================== */}
          {!loading && !error && safeHtml && (
            <div className="h-[650px] bg-muted/30 flex justify-center p-6">

              {/* DOCUMENT FRAME */}
              <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.15)] border overflow-hidden">

                {/* SINGLE SCROLL INSIDE IFRAME */}
                <iframe
                  srcDoc={safeHtml}
                  title="Quotation Preview"
                  className="w-full h-[650px] border-0"
                />

              </div>
            </div>
          )}

          {/* =========================
           * EMPTY
           ========================== */}
          {!loading && !error && !safeHtml && (
            <div className="h-[650px] flex items-center justify-center text-sm text-muted-foreground">
              No preview available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}