import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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

import { fetchQuotationPreviewHtml } from "../../../../app/slices/quotationSlice";

export default function FinalPreviewStep({ quotationId }) {
  const dispatch = useDispatch();

  const [previewHtml, setPreviewHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  /** =========================
   * FETCH
   ========================== */
  const loadPreview = async () => {
    if (!quotationId) return;

    try {
      setLoading(true);
      setError(false);

      const res = await dispatch(
        fetchQuotationPreviewHtml(quotationId)
      ).unwrap();

      // ✅ SAFE HANDLING
      const html =
        typeof res === "string"
          ? res
          : res?.html || res?.data || "";

      setPreviewHtml(html);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview();
  }, [quotationId]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Quotation Preview</div>
              <div className="text-xs text-muted-foreground">
                Client-ready proposal
              </div>
            </div>
          </div>

          <Button size="sm" variant="outline" onClick={loadPreview}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {/* PREVIEW */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/20 flex justify-between items-center">
          <div>
            <CardTitle className="text-base">
              Document Preview
            </CardTitle>
            <CardDescription>
              Final client view
            </CardDescription>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Desktop
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* LOADING */}
          {loading && (
            <div className="h-[650px] flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="h-[650px] flex flex-col items-center justify-center gap-3">
              <div className="text-sm text-red-500">
                Failed to load preview
              </div>
              <Button variant="outline" size="sm" onClick={loadPreview}>
                Retry
              </Button>
            </div>
          )}

          {/* SUCCESS */}
          {!loading && !error && previewHtml && (
            <div className="bg-muted/30 p-6">
              <div className="mx-auto max-w-5xl bg-white rounded-xl shadow-lg border overflow-hidden">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-[700px] border-0"
                  title="Preview"
                />
              </div>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && !previewHtml && (
            <div className="h-[650px] flex items-center justify-center text-sm text-muted-foreground">
              No preview available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}