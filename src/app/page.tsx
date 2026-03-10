"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import GlowButton from "@/components/ui/GlowButton";
import GlowInput from "@/components/ui/GlowInput";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const body = isRegister
        ? { username, password, name }
        : { username, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An error occurred");
        return;
      }

      // Save user session
      if (data.user) {
        login(data.user, rememberMe);
      }

      router.push("/dashboard");
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background mist layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-void-black via-ink-deep to-jade-deep/20" />
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-jade-deep/20 rounded-full blur-3xl animate-glow-pulse"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-mountain-blue/10 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-crimson-deep/10 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => {
        // Use deterministic values based on index to avoid hydration mismatch
        const randomSeed = (i * 12321) % 100;
        const topOffset = 60 + (randomSeed % 20);
        const xOffset = (randomSeed % 40) - 20;
        const duration = 4 + (randomSeed % 3);

        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-jade-glow/40 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, xOffset, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: i * 0.8,
            }}
            style={{
              left: `${15 + i * 14}%`,
              top: `${topOffset}%`,
            }}
          />
        );
      })}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-ink-deep/80 backdrop-blur-xl border border-jade-deep/40 rounded-2xl p-8 glow-subtle">
          {/* Title - bilingual */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-jade-glow mb-1 tracking-wider">
              修炼之路
            </h1>
            <p className="text-xs text-mist-mid tracking-[0.3em] uppercase">
              Path of Cultivation
            </p>
            <div className="mt-4 w-16 h-px bg-gradient-to-r from-transparent via-jade-glow to-transparent mx-auto" />
          </motion.div>

          {/* Decorative subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-mist-dark text-xs mb-6 italic"
          >
            {isRegister ? "踏入修仙界 — Enter the realm of cultivation" : "欢迎回来，修士 — Welcome back, cultivator"}
          </motion.p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlowInput
                label="道号 · Dao Name"
                placeholder="Enter your cultivator name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </motion.div>

            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <GlowInput
                  label="真名 · True Name"
                  placeholder="Your display name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlowInput
                label="密码 · Secret Art"
                type="password"
                placeholder="Enter your secret art"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            {/* Remember Me */}
            {!isRegister && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-ink-light bg-ink-dark accent-jade-glow cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-mist-mid cursor-pointer select-none">
                  记住我 · Remember Me
                </label>
              </motion.div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-crimson-light text-xs text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-2"
            >
              <GlowButton
                type="submit"
                variant="jade"
                size="lg"
                glow
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? "Channeling Qi..."
                  : isRegister
                  ? "Begin Cultivation 开始修炼"
                  : "Enter the Sect 进入宗门"}
              </GlowButton>
            </motion.div>
          </form>

          {/* Toggle register/login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-xs text-mist-mid hover:text-jade-glow transition-colors"
            >
              {isRegister
                ? "Already a cultivator? 已有账号 — Return to the sect"
                : "New cultivator? 新弟子 — Join the sect"}
            </button>
          </motion.div>

          {/* Bottom decoration */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-ink-light" />
            <span className="text-[10px] text-mist-dark">天道酬勤</span>
            <div className="w-8 h-px bg-ink-light" />
          </div>
          <p className="text-center text-[10px] text-mist-dark mt-1">
            Heaven rewards the diligent
          </p>
        </div>
      </motion.div>
    </div>
  );
}
