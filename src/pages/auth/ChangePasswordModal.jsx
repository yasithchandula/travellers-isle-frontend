import { useState } from "react";
import api from "@/api/axios";
import { toast } from "sonner";

export default function ChangePasswordModal({ onSuccess }) {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    /* ---------- CLIENT VALIDATION ---------- */
    if (!oldPw || !newPw || !confirmPw) {
      setError("All fields are required");
      return;
    }

    if (newPw.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPw !== confirmPw) {
      setError("New passwords do not match");
      return;
    }

    const loadingToast = toast.loading("Updating password...");

    try {
      setLoading(true);

      await api.put("/users/change-password", {
        old_password: oldPw,
        new_password: newPw,
      });

      toast.success("Password updated successfully", {
        id: loadingToast,
      });

      onSuccess(); 
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Password change failed";

      setError(msg);

      toast.error(msg, {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm overflow-hidden rounded-lg border bg-card shadow-xl"
      >
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your account password to continue.
          </p>
        </div>

        <div className="space-y-3 px-6 py-5">
          <input
            type="password"
            placeholder="Current Password"
            value={oldPw}
            onChange={(e) => setOldPw(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-1 focus-visible:ring-ring"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-1 focus-visible:ring-ring"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-1 focus-visible:ring-ring"
          />

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="border-t bg-card px-6 py-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
