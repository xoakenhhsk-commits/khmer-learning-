import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "chauvadut@2010") {
      toast.success("Đăng nhập Admin thành công!");
      sessionStorage.setItem("admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      toast.error("Mật khẩu không chính xác!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-2">Vui lòng nhập mật khẩu quản trị</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button type="submit"
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            Đăng nhập <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-8">
          Hệ thống quản lý từ vựng và OCR bằng Python.
        </p>
      </motion.div>
    </div>
  );
}
