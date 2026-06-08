import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-lg border bg-card shadow-xl"
        style={{ maxHeight: "90vh" }}
      >
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <button
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="max-h-[calc(90vh-65px)] overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
