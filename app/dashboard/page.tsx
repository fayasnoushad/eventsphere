"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EventData, UserSession } from "@/lib/types";
import { formatDate, getEventStatus } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        loadEvents();
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth/login");
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/events?myEvents=true");
      const data = await response.json();
      if (data.success) {
        setEvents(data.data.events);
      }
    } catch (error) {
      console.error("Load events error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Event deleted successfully");
        loadEvents();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete event");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the event");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            {user && (
              <p className="text-lg mt-2">
                Welcome back,{" "}
                <span className="font-semibold">{user.organizationName}</span>
              </p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/dashboard/events/create" className="btn btn-primary">
              ✨ Create New Event
            </Link>
            <Link href="/" className="btn btn-outline">
              🏠 Home
            </Link>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-4">No events yet</p>
            <p className="mb-6">Create your first tech fest or hackathon!</p>
            <Link href="/dashboard/events/create" className="btn btn-primary">
              Create Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const status = getEventStatus(event);
              return (
                <div
                  key={event._id?.toString()}
                  className="card bg-base-200 shadow-xl"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <h2 className="card-title">{event.name}</h2>
                      <span className={`badge badge-${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm opacity-70 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="text-sm mt-2">
                      <p>📍 {event.venue}</p>
                      <p>📅 {formatDate(event.startDate)}</p>
                      <p>👥 {event.totalRegistrations} registrations</p>
                      <p>🎯 Type: {event.type}</p>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <Link
                        href={`/dashboard/events/${event._id}/participants`}
                        className="btn btn-sm btn-outline"
                      >
                        Participants
                      </Link>
                      <Link
                        href={`/dashboard/events/${event._id}/edit`}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(event._id!.toString())}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
