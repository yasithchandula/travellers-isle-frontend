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
      <DialogContent className="max-w-6xl bg-background p-0">

        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[82vh] overflow-y-auto px-6 py-5">
          {children}
        </div>

        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button type="submit" form="entity-form">
            {submitText}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}