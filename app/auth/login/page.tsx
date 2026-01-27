"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row-reverse gap-5 items-center justify-center min-h-screen px-5">
      <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Organizer Login</h1>
        <p className="py-6">
          Login to manage your events, participants, and check-ins
        </p>
        <p className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="link link-primary">
            Sign up here
          </Link>
        </p>
      </div>

      <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl">
        <form className="card-body" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
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
            <label className="label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="input w-full"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex w-full items-center justify-between px-3 py-2 cursor-pointer text-gray-400 text-sm"
            >
              <span>{showPassword ? "Hide password" : "Show password"}</span>
            </button>
          </fieldset>

          <button
            type="submit"
            className="btn btn-neutral mt-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
