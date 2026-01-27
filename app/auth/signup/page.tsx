"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    contactPerson: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          organizationName: formData.organizationName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! Please login.");
        router.push("/auth/login");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Create Organizer Account</h1>
        <p className="mt-3">
          Register to create and manage tech fests and hackathons
        </p>
        <p className="text-sm mt-2">
          Already have an account?{" "}
          <Link href="/auth/login" className="link link-primary">
            Login here
          </Link>
        </p>
      </div>

      <div className="card bg-base-300 w-full max-w-md shadow-2xl">
        <form className="card-body" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <label className="label">Organization Name *</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Your College/Company Name"
              value={formData.organizationName}
              onChange={(e) =>
                setFormData({ ...formData, organizationName: e.target.value })
              }
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label">Contact Person *</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Your Full Name"
              value={formData.contactPerson}
              onChange={(e) =>
                setFormData({ ...formData, contactPerson: e.target.value })
              }
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label">Email *</label>
            <input
              type="email"
              className="input w-full"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label">Phone *</label>
            <input
              type="tel"
              className="input w-full"
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label">Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              className="input w-full"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label">Confirm Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              className="input w-full"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex w-full items-center justify-between px-3 py-2 cursor-pointer text-gray-400 text-sm"
            >
              <span>{showPassword ? "Hide passwords" : "Show passwords"}</span>
            </button>
          </fieldset>

          <button
            type="submit"
            className="btn btn-neutral mt-4"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
