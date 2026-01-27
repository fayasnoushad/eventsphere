"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Participant, EventData } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default function EventParticipantsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stats, setStats] = useState({ total: 0, checkedIn: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      // Load event details
      const eventResponse = await fetch(`/api/events/${params.id}`);
      const eventData = await eventResponse.json();
      if (!eventData.success) {
        router.push("/dashboard");
        return;
      }
      setEvent(eventData.data.event);

      // Load participants
      const partResponse = await fetch(
        `/api/participants?eventId=${params.id}`,
      );
      const partData = await partResponse.json();
      if (partData.success) {
        setParticipants(partData.data.participants);
        setStats({
          total: partData.data.total,
          checkedIn: partData.data.checkedIn,
        });
      }
    } catch (error) {
      console.error("Load data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (ticketId: string) => {
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId,
          eventId: params.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Check-in successful!");
        loadData();
      } else {
        alert(data.error || "Check-in failed");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      alert("An error occurred");
    }
  };

  const handleApprove = async (ticketId: string) => {
    try {
      const response = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId,
          eventId: params.id,
          action: "approve",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Participant approved!");
        loadData();
      } else {
        alert(data.error || "Approval failed");
      }
    } catch (error) {
      console.error("Approve error:", error);
      alert("An error occurred");
    }
  };

  const filteredParticipants = participants.filter((p) => {
    // Filter by status
    if (filter === "pending" && p.status !== "pending") return false;
    if (filter === "approved" && p.status !== "approved") return false;
    if (filter === "checked-in" && p.status !== "checked-in") return false;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term) ||
        p.phone.includes(term) ||
        p.ticketId.toLowerCase().includes(term) ||
        p.college.toLowerCase().includes(term)
      );
    }

    return true;
  });

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
        <div className="flex justify-between items-start mb-8">
          <div>
            <Link href="/dashboard" className="btn btn-outline btn-sm mb-4">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold">{event?.name}</h1>
            <p className="text-lg mt-2">Participant Management</p>
          </div>
          <Link
            href={`/dashboard/events/${params.id}/scan`}
            className="btn btn-primary"
          >
            📷 QR Scanner
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="font-semibold">Total Registered</h3>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="font-semibold">Checked In</h3>
              <p className="text-3xl font-bold">{stats.checkedIn}</p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="font-semibold">Pending</h3>
              <p className="text-3xl font-bold">
                {participants.filter((p) => p.status === "pending").length}
              </p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="font-semibold">Check-in Rate</h3>
              <p className="text-3xl font-bold">
                {stats.total > 0
                  ? Math.round((stats.checkedIn / stats.total) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, phone, or ID..."
            className="input input-bordered flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`btn ${filter === "all" ? "btn-primary" : "btn-outline"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`btn ${filter === "pending" ? "btn-primary" : "btn-outline"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`btn ${filter === "approved" ? "btn-primary" : "btn-outline"}`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("checked-in")}
              className={`btn ${filter === "checked-in" ? "btn-primary" : "btn-outline"}`}
            >
              Checked In
            </button>
          </div>
        </div>

        {/* Participants Table */}
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>College</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant) => (
                <tr key={participant._id?.toString()}>
                  <td className="font-mono text-xs">{participant.ticketId}</td>
                  <td>
                    <div className="font-semibold">{participant.name}</div>
                    <div className="text-xs opacity-70">
                      {participant.course} - Year {participant.year}
                    </div>
                  </td>
                  <td className="text-sm">{participant.college}</td>
                  <td className="text-sm">
                    <div>{participant.email}</div>
                    <div>{participant.phone}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        participant.status === "checked-in"
                          ? "badge-success"
                          : participant.status === "approved"
                            ? "badge-primary"
                            : participant.status === "pending"
                              ? "badge-warning"
                              : "badge-error"
                      }`}
                    >
                      {participant.status}
                    </span>
                  </td>
                  <td className="text-xs">
                    {formatDateTime(participant.registeredAt)}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {participant.status === "pending" && (
                        <button
                          onClick={() => handleApprove(participant.ticketId)}
                          className="btn btn-xs btn-success"
                        >
                          Approve
                        </button>
                      )}
                      {participant.status === "approved" && (
                        <button
                          onClick={() => handleCheckIn(participant.ticketId)}
                          className="btn btn-xs btn-primary"
                        >
                          Check In
                        </button>
                      )}
                      {participant.status === "checked-in" && (
                        <span className="text-success text-xs">
                          ✓ Checked In
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredParticipants.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl">No participants found</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
