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
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>

        {/* Name */}
        <input
          className={styles.input}
          type="text"
          placeholder="Full Name"
          name="UserName"
          value={form.UserName}
          onChange={handleChange}
        />

        {/* Email */}
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          name="EmailAddress"
          value={form.EmailAddress}
          onChange={handleChange}
        />

        {/* Password */}
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          name="Password"
          value={form.Password}
          onChange={handleChange}
        />

        {/* Mobile */}
        <input
          className={styles.input}
          type="text"
          placeholder="Mobile Number (Optional)"
          name="MobileNo"
          value={form.MobileNo}
          onChange={handleChange}
        />

        {/* Error */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Success */}
        {success && (
          <p style={{ color: "green", textAlign: "center" }}>{success}</p>
        )}

        {/* Button */}
        <button
          className={styles.button}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#4f46e5", cursor: "pointer" }}
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
