"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DriverLoginTruck, type TruckAnimationState } from "@/components/auth/DriverLoginTruck";

type Tab = "labour" | "admin";
type SubmitState = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("labour");

  const [labourId, setLabourId] = useState("");
  const [loginKey, setLoginKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [truckState, setTruckState] = useState<TruckAnimationState>("idle");

  async function submit(
    event: FormEvent,
    endpoint: string,
    body: Record<string, string>,
    redirectTo: string
  ) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitState("loading");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const responseBody = await response.json();

      if (!response.ok) {
        setSubmitState("error");
        setErrorMessage(responseBody?.error?.message ?? "Something went wrong. Please try again.");
        setShake(true);
        setTimeout(() => setShake(false), 400);
        return;
      }

      setSubmitState("success");
      setTruckState("departing");
      setTimeout(() => router.push(redirectTo), 850);
    } catch {
      setSubmitState("error");
      setErrorMessage("Could not reach the server. Check your connection and try again.");
    }
  }

  const isBusy = submitState === "loading" || submitState === "success";

  return (
    <div className="driver-login-page">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="driver-login-brand"
      >
        <img src="/agk-logo.svg" alt="AGK Logistics & Infrastructure" className="h-16 w-40 rounded-xl object-cover object-left shadow-lg shadow-black/20" />
        <span className="driver-login-logo">AGK Logistics & Infrastructure</span>
        <h1 className="driver-login-headline">
          Move. Manage.
          <span>Deliver.</span>
        </h1>
        <p className="driver-login-subtext">
          One system for every truck, every trip, and every rupee — from the
          yard to the ledger.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="driver-login-truck-panel"
      >
        <DriverLoginTruck state={truckState} />
      </motion.div>

      <div className="driver-login-auth">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`auth-card ${shake ? "auth-card--shake" : ""}`}
        >
          <span className="auth-card-eyebrow">Welcome back</span>
          <h2 className="auth-card-title">
            {tab === "labour" ? "Labour / Driver Access" : "Admin / Staff Access"}
          </h2>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              className="auth-tab relative"
              data-active={tab === "labour"}
              onClick={() => {
                setTab("labour");
                setErrorMessage(null);
                setSubmitState("idle");
              }}
            >
              Labour / Driver
              {tab === "labour" && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
            <button
              type="button"
              role="tab"
              className="auth-tab relative"
              data-active={tab === "admin"}
              onClick={() => {
                setTab("admin");
                setErrorMessage(null);
                setSubmitState("idle");
              }}
            >
              Admin / Staff
              {tab === "admin" && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === "labour" ? (
              <motion.form
                key="labour"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={(e) =>
                  submit(e, "/api/driver/login", { labourId, loginKey }, "/driver/select-truck")
                }
              >
                <div className="auth-field">
                  <label className="auth-label" htmlFor="labourId">
                    Labour ID
                  </label>
                  <input
                    id="labourId"
                    className="auth-input"
                    placeholder="LAB001"
                    autoComplete="username"
                    value={labourId}
                    onChange={(e) => setLabourId(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="loginKey">
                    Login Key
                  </label>
                  <div className="auth-input-wrap">
                    <input
                      id="loginKey"
                      className="auth-input"
                      type={showKey ? "text" : "password"}
                      placeholder="7K4P-92MX-81"
                      autoComplete="current-password"
                      value={loginKey}
                      onChange={(e) => setLoginKey(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-input-toggle"
                      onClick={() => setShowKey((v) => !v)}
                      aria-label={showKey ? "Hide login key" : "Show login key"}
                    >
                      {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-error">
                    {errorMessage}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="auth-submit"
                  data-state={submitState === "success" ? "success" : undefined}
                  disabled={isBusy}
                >
                  {submitState === "loading" && <Loader2 className="auth-spinner" size={18} />}
                  {submitState === "success" && <Check size={18} />}
                  {submitState === "loading"
                    ? "Signing in..."
                    : submitState === "success"
                      ? "Welcome aboard"
                      : "Sign in"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="admin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={(e) =>
                  submit(e, "/api/admin/login", { adminId, password }, "/admin/dashboard")
                }
              >
                <div className="auth-field">
                  <label className="auth-label" htmlFor="adminId">
                    Admin ID
                  </label>
                  <input
                    id="adminId"
                    className="auth-input"
                    placeholder="admin"
                    autoComplete="username"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="password">
                    Password
                  </label>
                  <div className="auth-input-wrap">
                    <input
                      id="password"
                      className="auth-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-input-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-error">
                    {errorMessage}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="auth-submit"
                  data-state={submitState === "success" ? "success" : undefined}
                  disabled={isBusy}
                >
                  {submitState === "loading" && <Loader2 className="auth-spinner" size={18} />}
                  {submitState === "success" && <Check size={18} />}
                  {submitState === "loading"
                    ? "Signing in..."
                    : submitState === "success"
                      ? "Welcome aboard"
                      : "Sign in"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
