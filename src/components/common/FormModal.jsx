import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function FormModal({
  open,
  onOpenChange,
  title,
  children,
  submitText
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden rounded-lg border bg-card p-0 shadow-xl">

        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(90vh-137px)] overflow-y-auto px-6 py-5">
          {children}
        </div>

        <div className="flex justify-end gap-2 border-t bg-card px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button type="submit" form="entity-form" className="min-w-[140px]">
            {submitText}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
