"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../login/login.module.css"; // reuse login css

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    UserName: "",
    EmailAddress: "",
    Password: "",
    MobileNo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================
  // Handle Input Change
  // =====================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =====================
  // Register Submit
  // =====================
  const handleRegister = async () => {
    const { UserName, EmailAddress, Password } = form;

    if (!UserName || !EmailAddress || !Password) {
      setError("Name, Email and Password are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          RoleID: 2, // default user
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess("Registered successfully! Redirecting...");

      // Go to login after 2 sec
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError("Something went wrong");
    }

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
              Create your account to capture receipts, manage budgets, and stay
              on top of approvals.
            </p>
          </div>
          <div className={styles.heroImage} aria-hidden="true" />
        </section>

        <section className={styles.form}>
          <div className={styles.cardHeader}>
            <p className={styles.brand}>ExpanceFlow</p>
            <h2 className={styles.title}>Create account</h2>
            <p className={styles.subtitle}>
              Start managing expenses in minutes.
            </p>
          </div>

          <label className={styles.label}>
            Full name
            <input
              className={styles.input}
              type="text"
              placeholder="Full Name"
              name="UserName"
              value={form.UserName}
              onChange={handleChange}
            />
          </label>

          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              placeholder="you@company.com"
              name="EmailAddress"
              value={form.EmailAddress}
              onChange={handleChange}
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              placeholder="********"
              name="Password"
              value={form.Password}
              onChange={handleChange}
            />
          </label>

          <label className={styles.label}>
            Mobile (optional)
            <input
              className={styles.input}
              type="text"
              placeholder="Mobile Number"
              name="MobileNo"
              value={form.MobileNo}
              onChange={handleChange}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button
            className={styles.button}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className={styles.footerText}>
            Already have an account?{" "}
            <span
              className={styles.link}
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}

