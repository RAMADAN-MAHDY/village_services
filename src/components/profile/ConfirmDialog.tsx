"use client";

import { motion } from "framer-motion";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg"
      >
        <p className="mb-4 text-lg font-semibold">{message}</p>
        <div className="flex justify-around">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              if (!loading) onConfirm();
            }}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="inline-block"
              >
                ⏳
              </motion.span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
