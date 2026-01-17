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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-sm"
      >
        <h2 className="text-lg font-semibold mb-4">
          Change Password
        </h2>

        {/* Old Password */}
        <input
          type="password"
          placeholder="Current Password"
          value={oldPw}
          onChange={(e) => setOldPw(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* New Password */}
        <input
          type="password"
          placeholder="New Password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* Inline validation / API error */}
        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
