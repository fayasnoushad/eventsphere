"use client";
import Link from "next/link";
import ThemeDropdown from "./ThemeDropdown";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session");
      setIsAuthenticated(response.ok);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/";
  };

  return (
    <header className="navbar min-h-[10vh] bg-base-300 shadow-sm px-5 py-2">
      <Link
        href="/"
        className="text-2xl font-bold flex flex-row gap-2 items-center justify-center"
      >
        <Image src="/favico.ico" alt="Icon" className="rounded-[50%]" width={50} height={50} />
        EventSphere
      </Link>
      <div className="flex flex-row justify-center items-center ml-auto gap-2">
        <ThemeDropdown />
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost m-1">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              data-slot="icon"
              aria-hidden="true"
              className="tva"
              width={20}
            >
              <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"></path>
            </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 border-(length:--border) border-white/5 shadow-2xl outline-(length:--border) outline-black/5 "
          >
            <Link
              className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
              href="/"
            >
              Browse Events
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
                  href="/dashboard"
                >
                  Dashboard
                </Link>

                <span
                  onClick={handleLogout}
                  className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
                >
                  Logout
                </span>
              </>
            ) : (
              <>
                <Link
                  className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
                  href="/auth/login"
                >
                  Organizer Login
                </Link>
                <Link
                  className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
                  href="/auth/signup"
                >
                  Create Account
                </Link>
              </>
            )}

            <Link
              className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
              href="/certificate"
            >
              Certificate
            </Link>
            <Link
              className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
              href="https://github.com/fayasnoushad/eventsphere"
            >
              Source Code
            </Link>
          </ul>
        </div>
      </div>
    </header>
  );
}
