import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/animate-ui/components/radix/dialog";

export default function AnimatedDialog({
  open,
  onOpenChange,
  title,
  description,
  from = "bottom",
  showCloseButton = true,
  preventClose = true,
  footer,
  children,
  className = "sm:max-w-lg",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        from={from}
        showCloseButton={showCloseButton}
        className={`bg-white ${className}`}
        onInteractOutside={(e) => preventClose && e.preventDefault()}
        onEscapeKeyDown={(e) => preventClose && e.preventDefault()}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </DialogHeader>
        )}

        {children}

        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
