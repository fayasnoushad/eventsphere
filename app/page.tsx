"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { EventData } from "@/lib/types";
import { formatDate, getEventStatus } from "@/lib/utils";

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/auth/session");
        setLoginStatus(response.ok);
      } catch (error) {
        console.error("Login status check error:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data);
      if (data.success && data.data && data.data.events) {
        setEvents(data.data.events);
      } else if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.warn("Unexpected data structure:", data);
      }
    } catch (error) {
      console.error("Load events error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.type === filter;
  });

  return (
    <main className="flex flex-col justify-center items-center text-center min-h-screen mx-5">
      <div className="mt-[10vh] mb-10">
        <span className="text-5xl font-bold">EventSphere</span>
        <p className="text-xl mt-5">Discover Tech Fests & Hackathons</p>
        <h3 className="text-lg font-semibold mt-3">
          Your Gateway to Inter-College Technical Events
        </h3>

        {loginStatus ? (
          <div className="flex flex-row flex-wrap justify-center mt-8 gap-5 font-bold mx-5">
            <Link
              className="btn btn-primary rounded font-bold text-lg"
              href="/dashboard"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap justify-center mt-8 gap-5 font-bold mx-5">
            <Link
              className="btn btn-primary rounded font-bold text-lg"
              href="/auth/login"
            >
              Organizer Login →
            </Link>
            <Link
              className="btn btn-outline rounded font-bold text-lg"
              href="/auth/signup"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>

      {/* Event Type Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline"}`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilter("tech-fest")}
          className={`btn btn-sm ${filter === "tech-fest" ? "btn-primary" : "btn-outline"}`}
        >
          Tech Fests
        </button>
        <button
          onClick={() => setFilter("hackathon")}
          className={`btn btn-sm ${filter === "hackathon" ? "btn-primary" : "btn-outline"}`}
        >
          Hackathons
        </button>
        <button
          onClick={() => setFilter("workshop")}
          className={`btn btn-sm ${filter === "workshop" ? "btn-primary" : "btn-outline"}`}
        >
          Workshops
        </button>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="py-20">
          <span className="loading loading-dots loading-xl"></span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-20">
          <p className="text-2xl">No events available</p>
          <p className="mt-4">Check back soon for upcoming events!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl mb-20">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event);
            const isOpen = status.label === "Open for Registration";

            return (
              <div
                key={event._id?.toString()}
                className="card bg-base-200 shadow-xl text-left"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h2 className="card-title">{event.name}</h2>
                    <span className={`badge badge-${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <p className="text-sm opacity-70">
                    by {event.organizationName}
                  </p>

                  <p className="line-clamp-3">{event.description}</p>

                  <div className="text-sm mt-2 space-y-1">
                    <p>📍 {event.venue}</p>
                    <p>📅 {formatDate(event.startDate)}</p>
                    <p>🎯 {event.type.replace("-", " ").toUpperCase()}</p>
                    {event.registrationFee > 0 && (
                      <p>💰 ₹{event.registrationFee}</p>
                    )}
                    <p>👥 {event.totalRegistrations} registered</p>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link
                      href={`/events/${event.slug}`}
                      className="btn btn-sm btn-outline"
                    >
                      View Details
                    </Link>
                    {isOpen && (
                      <Link
                        href={`/events/${event.slug}/register`}
                        className="btn btn-sm btn-primary"
                      >
                        Register Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
