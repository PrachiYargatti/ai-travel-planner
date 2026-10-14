import { useState } from "react";
import { FiX, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";

import api from "../services/api";

function UpdatePasswordModal({ onClose }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.newPassword.length < 8 ||
      !/[A-Za-z]/.test(form.newPassword) ||
      !/[0-9]/.test(form.newPassword)
    ) {
      toast.error("Password must be 8+ characters with at least one letter and one number");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      setLoading(true);

      await api.put("/auth/update-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password updated successfully");
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-7 relative animate-[fadeIn_0.15s_ease-out] border border-slate-100 dark:border-slate-700">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <FiX size={20} />
        </button>

        <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
          <FiLock size={19} />
        </div>

        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
          Update Password
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Keep your account secure with a strong, unique password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              placeholder="Current password"
              value={form.currentPassword}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 rounded-lg pr-11 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />

            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {showCurrent ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              placeholder="New password (min. 8 characters)"
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 rounded-lg pr-11 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />

            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {showNew ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </button>
          </div>

          <input
            type={showNew ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors shadow-md shadow-indigo-600/20"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePasswordModal;
