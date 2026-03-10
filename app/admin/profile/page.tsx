"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarClock, Camera, Mail, Phone, Save, User2 } from "lucide-react";

type Profile = {
  UserID: number;
  UserName: string;
  Email: string;
  MobileNo?: string;
  ProfileImage?: string | null;
  RoleID?: number;
  Role: string;
  Created?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data: Profile) => {
        setProfile(data);
        setName(data.UserName || "");
        setMobile(data.MobileNo || "");
        setProfileImage(data.ProfileImage || "");
      })
      .catch((err) => setError(err.message || "Unable to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/users/${profile.UserID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserName: name.trim(),
          EmailAddress: profile.Email,
          MobileNo: mobile.trim(),
          RoleID: profile.RoleID ?? 2,
          ProfileImage: profileImage.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save profile");
      }

      const latest = await fetch("/api/auth/me").then((r) => r.json());
      setProfile(latest);
      setName(latest.UserName || "");
      setMobile(latest.MobileNo || "");
      setProfileImage(latest.ProfileImage || "");
      alert("Profile updated successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    try {
      const res = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to upload image");
      }

      const data = await res.json();
      setProfileImage(data.url || "");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        Loading profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-6 text-rose-600">
        {error || "Profile not found"}
      </div>
    );
  }

  const initials = name.trim().charAt(0).toUpperCase() || "U";
  const joinedDate = profile.Created
    ? new Date(profile.Created).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-20 w-20 rounded-2xl border border-[var(--border)] object-cover shadow-[0_12px_28px_rgba(15,23,42,0.22)]"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--accent)] text-3xl font-black text-[var(--accent-contrast)] shadow-[0_12px_28px_rgba(15,23,42,0.22)]">
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
                title="Upload profile image"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Account Center
              </p>
              <h1 className="text-3xl font-semibold text-[var(--foreground)]">{name}</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">{profile.Email}</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || uploadingImage}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] shadow-[0_10px_22px_rgba(15,23,42,0.18)] hover:opacity-90 disabled:opacity-60"
          >
            <Save size={14} />
            {uploadingImage ? "Uploading Image..." : saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        <MetricCard label="Joined" value={joinedDate} icon={<CalendarClock size={16} />} />
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="mb-4 text-sm font-semibold text-[var(--muted)]">Profile Information</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Full Name
            </label>
            <div className="relative">
              <User2
                size={16}
                className="pointer-events-none absolute left-3 top-3 text-[var(--muted-2)]"
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-3 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Mobile Number
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="pointer-events-none absolute left-3 top-3 text-[var(--muted-2)]"
              />
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-3 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Email Address
            </label>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                {profile.Email}
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Use the camera icon on avatar to choose image from your device.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
        <span className="text-[var(--muted)]">{icon}</span>
      </div>
      <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
