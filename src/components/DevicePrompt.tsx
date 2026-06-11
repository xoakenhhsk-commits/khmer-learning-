import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Smartphone, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function DevicePrompt() {
  const { user, deviceOS, setDeviceOS } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show prompt if user is logged in and deviceOS is still 'auto'
    if (user && deviceOS === "auto") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user, deviceOS]);

  const handleSelect = (os: "ios" | "android" | "desktop") => {
    setDeviceOS(os);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-[var(--card)] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[var(--border)]"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-2xl flex items-center justify-center">
              <Smartphone size={32} />
            </div>
            <h2 className="text-2xl font-black mb-2 text-[var(--text)]">Thiết bị của bạn?</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Vui lòng chọn thiết bị bạn đang dùng để chúng tôi tối ưu hóa giao diện (tránh lỗi tai thỏ, viền đen...).
            </p>
          </div>

          <div className="grid gap-3">
            <button
              onClick={() => handleSelect("ios")}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[var(--border)] hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                🍎
              </div>
              <div>
                <h3 className="font-bold text-[var(--text)]">iPhone / iPad</h3>
                <p className="text-xs text-[var(--text-muted)]">Tối ưu cho Tai thỏ / Dynamic Island</p>
              </div>
            </button>

            <button
              onClick={() => handleSelect("android")}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[var(--border)] hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-[var(--text)]">Điện thoại Android</h3>
                <p className="text-xs text-[var(--text-muted)]">Giao diện tràn viền tiêu chuẩn</p>
              </div>
            </button>

            <button
              onClick={() => handleSelect("desktop")}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[var(--border)] hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
                <Monitor size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text)]">Máy tính / Laptop</h3>
                <p className="text-xs text-[var(--text-muted)]">Màn hình rộng tiêu chuẩn</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
