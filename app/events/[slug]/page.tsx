"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EventData } from "@/lib/types";
import { formatDate, formatDateTime, getEventStatus } from "@/lib/utils";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [params.slug]);

  const loadEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.slug}`);
      const data = await response.json();
      if (data.success) {
        setEvent(data.data.event);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Load event error:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const status = getEventStatus(event);
  const isOpen = status.label === "Open for Registration";

  return (
    <main className="min-h-screen p-5">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <Link href="/" className="btn btn-outline btn-sm mb-4">
              ← Back to Events
            </Link>
            <h1 className="text-5xl font-bold">{event.name}</h1>
            <p className="text-xl mt-2 opacity-70">
              by {event.organizationName}
            </p>
            <div className="flex items-center gap-2 mt-2 opacity-60 text-sm">
              <span>Event ID:</span>
              <code className="bg-base-300 px-2 py-1 rounded font-mono">
                {event._id?.toString()}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(event._id?.toString() || "");
                  alert("Event ID copied!");
                }}
                className="btn btn-ghost btn-xs"
              >
                📋
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              <span className={`badge badge-${status.color} badge-lg`}>
                {status.label}
              </span>
              <span className="badge badge-lg">
                {event.type.replace("-", " ").toUpperCase()}
              </span>
            </div>
          </div>
          {isOpen && (
            <Link
              href={`/events/${event.slug}/register`}
              className="btn btn-primary btn-lg"
            >
              Register Now →
            </Link>
          )}
        </div>

        {/* Quick Info */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="font-semibold">📍 Venue</h3>
              <p>{event.venue}</p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="font-semibold">📅 Dates</h3>
              <p className="text-sm">{formatDate(event.startDate)}</p>
              <p className="text-sm">to {formatDate(event.endDate)}</p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="font-semibold">⏰ Registration Deadline</h3>
              <p className="text-sm">
                {formatDate(event.registrationDeadline)}
              </p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="font-semibold">💰 Fee</h3>
              <p>
                {event.registrationFee > 0
                  ? `₹${event.registrationFee}`
                  : "Free"}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card bg-base-200 mb-8">
          <div className="card-body">
            <h2 className="card-title">About the Event</h2>
            <p className="whitespace-pre-line">{event.description}</p>
          </div>
        </div>

        {/* Sub-events */}
        {event.subEvents && event.subEvents.length > 0 && (
          <div className="card bg-base-200 mb-8">
            <div className="card-body">
              <h2 className="card-title">Competitions & Activities</h2>
              <div className="space-y-4 mt-4">
                {event.subEvents.map((subEvent, index) => (
                  <div key={index} className="card bg-base-300">
                    <div className="card-body">
                      <h3 className="font-bold text-lg">{subEvent.name}</h3>
                      <p>{subEvent.description}</p>
                      {subEvent.rules && subEvent.rules.length > 0 && (
                        <div className="mt-2">
                          <h4 className="font-semibold">Rules:</h4>
                          <ul className="list-disc list-inside">
                            {subEvent.rules.map((rule, ruleIndex) => (
                              <li key={ruleIndex} className="text-sm">
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {subEvent.prize && (
                        <div className="mt-2">
                          <h4 className="font-semibold">Prizes:</h4>
                          <p className="text-sm">
                            1st: ₹{subEvent.prize.first} | 2nd: ₹
                            {subEvent.prize.second}
                            {subEvent.prize.third &&
                              ` | 3rd: ₹${subEvent.prize.third}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Guidelines */}
        {event.guidelines && event.guidelines.length > 0 && (
          <div className="card bg-base-200 mb-8">
            <div className="card-body">
              <h2 className="card-title">Guidelines</h2>
              <ul className="list-disc list-inside space-y-2 mt-4">
                {event.guidelines.map((guideline, index) => (
                  <li key={index}>{guideline}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="card bg-base-200 mb-8">
          <div className="card-body">
            <h2 className="card-title">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <p>
                📧 Email:{" "}
                <a href={`mailto:${event.contactEmail}`} className="link">
                  {event.contactEmail}
                </a>
              </p>
              <p>
                📞 Phone:{" "}
                <a href={`tel:${event.contactPhone}`} className="link">
                  {event.contactPhone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Registration CTA */}
        {isOpen && (
          <div className="text-center py-8">
            <Link
              href={`/events/${event.slug}/register`}
              className="btn btn-primary btn-lg"
            >
              Register for {event.name} →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
