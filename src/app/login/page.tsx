import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useStore, User } from "@/store/useStore";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { syncUserProfile } from "@/lib/user";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthSuccess = async (firebaseUser: any) => {
    const userData: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Học viên",
      email: firebaseUser.email || "",
      xp: 0, 
      level: 1, 
      streakDays: 0, 
      hearts: 5, 
      role: "USER",
      avatar: firebaseUser.photoURL || undefined
    };

    // Sync with Firestore
    const syncedUser = await syncUserProfile(userData);
    setUser(syncedUser || userData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { auth, signInWithEmailAndPassword } = await import("@/lib/firebase");
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      await handleAuthSuccess(userCredential.user);
      
      toast.success("Chào mừng trở lại! 🎉");
      navigate("/learn");
    } catch (err: any) {
      toast.error("Lỗi đăng nhập: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { signInWithPopup, auth, googleProvider } = await import("@/lib/firebase");
      const result = await signInWithPopup(auth, googleProvider);
      await handleAuthSuccess(result.user);
      toast.success("Đăng nhập Google thành công!");
      navigate("/learn");
    } catch (e: any) {
      toast.error("Lỗi đăng nhập Google: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setUser({
      id: "demo-1", name: "Học Viên Demo", email: "demo@khmerlearn.com",
      xp: 250, level: 3, streakDays: 7, hearts: 5, role: "USER",
    });
    toast.success("Đã vào chế độ Demo! 🎓");
    navigate("/learn");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #1CB0F6 0%, #58CC02 100%)" }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-white mb-6 hover:opacity-80">
          <ArrowLeft size={20} /> Quay lại
        </Link>

        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">👋</div>
            <h1 className="text-2xl font-black">Chào mừng trở lại!</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Tiếp tục học tiếng Khmer</p>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <button onClick={handleDemo}
              className="w-full py-3 rounded-2xl font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #FF9600, #FF4B4B)" }}>
              ⚡ Dùng thử Demo
            </button>

            <button onClick={handleGoogleLogin} disabled={loading}
              className="w-full py-3 rounded-2xl font-bold bg-white border-2 border-gray-200 text-gray-700 transition-all hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.369 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
              )}
              Đăng nhập bằng Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>HOẶC</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                <Mail size={18} />
              </div>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 rounded-2xl outline-none font-medium"
                style={{ background: "var(--bg-secondary)", border: "2px solid var(--border)", color: "var(--text)" }} />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                <Lock size={18} />
              </div>
              <input type={show ? "text" : "password"} required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mật khẩu"
                className="w-full pl-12 pr-12 py-3 rounded-2xl outline-none font-medium"
                style={{ background: "var(--bg-secondary)", border: "2px solid var(--border)", color: "var(--text)" }} />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={loading} 
              className="btn-primary w-full text-base disabled:opacity-50">
              {loading ? "⏳ Đang đăng nhập..." : "🔐 Đăng nhập"}
            </button>
          </form>

          <div className="flex items-center justify-between mt-4">
            <Link to="/forgot-password" className="text-sm font-semibold" style={{ color: "var(--blue)" }}>
              Quên mật khẩu?
            </Link>
            <Link to="/register" className="text-sm font-semibold" style={{ color: "var(--green)" }}>
              Tạo tài khoản mới
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
