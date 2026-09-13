"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check, Truck } from "lucide-react";
import { DriverLoginTruck, type TruckAnimationState } from "@/components/auth/DriverLoginTruck";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Tab = "labour" | "admin";
type SubmitState = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("labour");
  const [labourId, setLabourId] = useState("");
  const [loginKey, setLoginKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [truckState, setTruckState] = useState<TruckAnimationState>("idle");

  async function handleLabourSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitState("loading");

    try {
      const response = await fetch("/api/driver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labourId, loginKey }),
      });
      const body = await response.json();

      if (!response.ok) {
        setSubmitState("error");
        setErrorMessage(body?.error?.message ?? "Something went wrong. Please try again.");
        setShake(true);
        setTimeout(() => setShake(false), 400);
        return;
      }

      setSubmitState("success");
      setTruckState("departing");
      setTimeout(() => router.push("/driver/select-truck"), 850);
    } catch {
      setSubmitState("error");
      setErrorMessage("Could not reach the server. Check your connection and try again.");
    }
  }

  async function handleGoogleSignIn() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  }

  return (
    <div className="driver-login-page">
      <div className="driver-login-brand">
        <span className="driver-login-logo">Fleet Operations</span>
        <h1 className="driver-login-headline">
          Move. Manage.
          <span>Deliver.</span>
        </h1>
        <p className="driver-login-subtext">
          One system for every truck, every trip, and every rupee — from the
          yard to the ledger.
        </p>
      </div>

      <div className="driver-login-truck-panel">
        <DriverLoginTruck state={truckState} />
      </div>

      <div className="driver-login-auth">
        <div className={`auth-card ${shake ? "auth-card--shake" : ""}`}>
          <span className="auth-card-eyebrow">Welcome back</span>
          <h2 className="auth-card-title">
            {tab === "labour" ? "Labour / Driver Access" : "Admin / Staff Access"}
          </h2>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              className="auth-tab"
              data-active={tab === "labour"}
              onClick={() => setTab("labour")}
            >
              Labour / Driver
            </button>
            <button
              type="button"
              role="tab"
              className="auth-tab"
              data-active={tab === "admin"}
              onClick={() => setTab("admin")}
            >
              Admin / Staff
            </button>
          </div>

          {tab === "labour" ? (
            <form onSubmit={handleLabourSubmit}>
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

              {errorMessage && <p className="auth-error">{errorMessage}</p>}

              <button
                type="submit"
                className="auth-submit"
                data-state={submitState === "success" ? "success" : undefined}
                disabled={submitState === "loading" || submitState === "success"}
              >
                {submitState === "loading" && <Loader2 className="auth-spinner" size={18} />}
                {submitState === "success" && <Check size={18} />}
                {submitState === "loading"
                  ? "Signing in..."
                  : submitState === "success"
                    ? "Welcome aboard"
                    : "Sign in"}
              </button>
            </form>
          ) : (
            <div>
              <p className="driver-login-subtext" style={{ marginTop: "1.25rem" }}>
                Sign in with your company Google account. Access is granted by
                a Super Admin after your first sign-in.
              </p>
              <button type="button" className="auth-oauth-button" onClick={handleGoogleSignIn}>
                <Truck size={18} />
                Continue with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
