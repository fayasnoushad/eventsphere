"use client";
import Link from "next/link";
import ThemeDropdown from "./ThemeDropdown";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const password = localStorage.getItem("password");
    if (password && password?.length > 0) setLoginStatus(true);
  }, []);
  return (
    <header className="navbar min-h-[10vh] bg-base-300 shadow-sm px-5 py-2">
      <Link
        href="/"
        className="text-2xl font-bold flex flex-row gap-2 items-center justify-center"
      >
        <Image src="/favico.ico" alt="Icon" width={50} height={50} />
        TE-X-US
      </Link>
      <div className="flex flex-row justify-center items-center ml-auto">
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
              Events
            </Link>
            <Link
              className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
              href="/register"
            >
              Register
            </Link>
            <Link
              className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
              href="/schedule"
            >
              Time Schedule
            </Link>
            <Link
              className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
              href="/certificate"
            >
              Certificate
            </Link>
            {/* Only admin can login and see participant details */}
            {loginStatus && (
              <Link
                className="font-semibold p-3 w-full rounded-2xl hover:bg-base-300"
                href="/admin"
              >
                Admin
              </Link>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
