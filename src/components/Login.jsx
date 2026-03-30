import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck } from "lucide-react";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Welcome to Aura Control Center");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 font-sans">
      {/* Main Card */}
      <div className="max-w-[450px] w-full bg-white p-10 md:p-14 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden">
        {/* Top Accent Decoration */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-black"></div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-black text-white rounded-2xl mb-6 shadow-xl">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Aura Admin
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">
            Secure Authorization
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="admin@aurafashion.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all font-bold text-sm"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">
              Security Key
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all font-bold text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Verifying...
              </>
            ) : (
              "Authorize Access"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[11px] text-gray-400 font-medium">
            Protected by Aura Security Systems.
            <br />
            <span className="text-gray-300">© 2026 All Rights Reserved.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
