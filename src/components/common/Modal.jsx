import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="relative w-full max-w-5xl overflow-auto rounded-lg border bg-background p-6 shadow-xl"
        style={{ maxHeight: "90vh" }}
      >
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        <button
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
