"use client";
export default function NotFoundPage() {
  return (
    <main className="flex flex-col justify-center items-center text-3xl">
      <span className="block mb-5">404 - Page not found</span>
      <button
        className="btn btn-info rounded-full"
        onClick={() => (window.location.href = "/")}
      >
        Go to Home Page
      </button>
    </main>
  );
}
