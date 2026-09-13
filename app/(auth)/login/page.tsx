"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
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
              onClick={() => {
                setTab("labour");
                setErrorMessage(null);
                setSubmitState("idle");
              }}
            >
              Labour / Driver
            </button>
            <button
              type="button"
              role="tab"
              className="auth-tab"
              data-active={tab === "admin"}
              onClick={() => {
                setTab("admin");
                setErrorMessage(null);
                setSubmitState("idle");
              }}
            >
              Admin / Staff
            </button>
          </div>

          {tab === "labour" ? (
            <form
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

              {errorMessage && <p className="auth-error">{errorMessage}</p>}

              <button
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
              </button>
            </form>
          ) : (
            <form
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

              {errorMessage && <p className="auth-error">{errorMessage}</p>}

              <button
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
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
