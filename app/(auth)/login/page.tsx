"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      credentials: "include",

      body: JSON.stringify({
        EmailAddress: email,
        Password: password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroTop}>
            <span className={styles.badge}>ExpanceFlow Platform</span>
            <h1 className={styles.heroTitle}>Finance Control Hub</h1>
            <p className={styles.heroSubtitle}>
              A premium workspace to manage expenses, income, projects, and
              operational decisions in one secure flow.
            </p>
          </div>
          <div className={styles.heroImage} aria-hidden="true" />
          {/* <div className={styles.heroCard}>
            <div>
              <p className={styles.heroStatLabel}>Monthly Spend</p>
              <p className={styles.heroStatValue}>$24,980</p>
            </div>
            <div>
              <p className={styles.heroStatLabel}>Approvals</p>
              <p className={styles.heroStatValue}>18 Pending</p>
            </div>
          </div> */}
        </section>

        <section className={styles.form}>
          <div className={styles.cardHeader}>
            <p className={styles.brand}>ExpanceFlow</p>
            <h2 className={styles.title}>Welcome back</h2>
            <p className={styles.subtitle}>Sign in to continue</p>
          </div>

          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.button}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className={styles.footerText}>
            Don&apos;t have an account?{" "}
            <span
              className={styles.link}
              onClick={() => router.push("/register")}
            >
              Register
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}
