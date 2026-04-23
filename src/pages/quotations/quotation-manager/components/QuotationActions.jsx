"use client";

import React, { useState } from "react";
import { Eye, FileText, MoreHorizontal, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { fetchQuotationPreviewHtml } from "../../../../app/slices/quotationSlice";

export default function QuotationActions({ quotationId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openPreview, setOpenPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  /* =========================
     HANDLE OPEN
  ========================= */
  const handleOpen = () => {
    if (!quotationId) return;

    navigate(`/quotations/${quotationId}`);
  };

  /* =========================
     HANDLE PREVIEW
  ========================= */
  const handlePreview = async () => {
    if (!quotationId) return;

    try {
      setLoadingPreview(true);
      setOpenPreview(true);

      const res = await dispatch(
        fetchQuotationPreviewHtml(quotationId)
      ).unwrap();

      // assuming API returns html string
      setPreviewHtml(res?.html || res || "");
    } catch (err) {
      toast.error("Failed to load preview");
      setOpenPreview(false);
    } finally {
      setLoadingPreview(false);
    }
  };

  return (
    <>
      {/* ================= DROPDOWN ================= */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={handleOpen}>
            <Eye className="mr-2 h-4 w-4" />
            Open
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handlePreview}>
            <FileText className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ================= PREVIEW MODAL ================= */}
      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Quotation Preview</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto rounded-lg border p-4 bg-muted/30">
            {loadingPreview ? (
              <div className="flex items-center justify-center h-60">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : previewHtml ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="text-center text-muted-foreground py-10">
                No preview available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}