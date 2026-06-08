import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function EntityDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  bodyClassName,
  preventOutsideClose = false,
}) {
  const guardedProps = preventOutsideClose
    ? {
        onInteractOutside: (event) => event.preventDefault(),
        onEscapeKeyDown: (event) => event.preventDefault(),
      }
    : {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[90vh] flex-col overflow-hidden rounded-lg border bg-card p-0 shadow-xl sm:max-w-xl",
          className
        )}
        {...guardedProps}
      >
        <DialogHeader className="shrink-0 border-b px-6 py-4 text-left">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className={cn("min-h-0 flex-1 overflow-y-auto px-6 py-5", bodyClassName)}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
