"use client";
import { useEffect, useState } from "react";
import Participants from "./components/Participants/Participants";

export default function Admin() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedPassword = localStorage.getItem("password");
    if (savedPassword) setLoginStatus(true);
  }, []);

  const handleLogin = async () => {
    const response = await fetch("/api/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("password", password.trim());
      window.location.reload();
    } else alert(data.error ? data.error : "Something wrong!");
  };

  return loginStatus ? (
    <main className="min-h-screen">
      <Participants />
    </main>
  ) : (
    <main className="flex flex-col lg:flex-row-reverse gap-5 items-center justify-center min-h-screen">
      <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Login now!</h1>
        <p className="py-6">Login using admin password to more!</p>
      </div>
      <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <fieldset className="fieldset">
            <label className="label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="hs-toggle-password"
              className="input w-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-pressed={showPassword}
              className="flex w-full items-center justify-between px-3 py-2 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
            >
              <span>{showPassword ? "Hide password" : "Show password"}</span>
              <svg
                className="shrink-0 size-4"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {showPassword ? (
                  <>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </>
                ) : (
                  <>
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                  </>
                )}
              </svg>
            </button>
          </fieldset>
          <button className="btn btn-neutral mt-4" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </main>
  );
}
