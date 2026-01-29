"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { EventFormData, EventSubEvent, EventData } from "@/lib/types";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    type: "tech-fest",
    venue: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    registrationFee: 0,
    requiresApproval: false,
    upiId: "",
    contactEmail: "",
    contactPhone: "",
    guidelines: [],
    subEvents: [],
    enableCertificates: false,
    enableMealPreferences: false,
  });

  const [guidelineInput, setGuidelineInput] = useState("");
  const [subEventForm, setSubEventForm] = useState<Partial<EventSubEvent>>({
    name: "",
    description: "",
    rules: [],
  });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();

        if (response.ok && data.data?.event) {
          const event: EventData = data.data.event;

          // Convert dates to YYYY-MM-DD format for input fields
          const formatDate = (date: string | Date) => {
            const d = new Date(date);
            return d.toISOString().split("T")[0];
          };

          setFormData({
            name: event.name,
            description: event.description,
            type: event.type,
            venue: event.venue,
            startDate: formatDate(event.startDate),
            endDate: formatDate(event.endDate),
            registrationDeadline: formatDate(event.registrationDeadline),
            registrationFee: event.registrationFee,
            requiresApproval: event.requiresApproval,
            upiId: event.upiId || "",
            contactEmail: event.contactEmail,
            contactPhone: event.contactPhone,
            guidelines: event.guidelines || [],
            subEvents: event.subEvents || [],
            enableCertificates: event.enableCertificates || false,
            enableMealPreferences: event.enableMealPreferences || false,
            maxParticipants: event.maxParticipants,
          });
        } else {
          alert(data.error || "Failed to fetch event");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Fetch event error:", error);
        alert("An error occurred while loading the event.");
        router.push("/dashboard");
      } finally {
        setFetching(false);
      }
    };

    fetchEvent();
  }, [eventId, router]);

  const addGuideline = () => {
    if (guidelineInput.trim()) {
      setFormData({
        ...formData,
        guidelines: [...formData.guidelines, guidelineInput.trim()],
      });
      setGuidelineInput("");
    }
  };

  const removeGuideline = (index: number) => {
    setFormData({
      ...formData,
      guidelines: formData.guidelines.filter((_, i) => i !== index),
    });
  };

  const addSubEvent = () => {
    if (subEventForm.name && subEventForm.description) {
      setFormData({
        ...formData,
        subEvents: [
          ...formData.subEvents,
          {
            name: subEventForm.name,
            description: subEventForm.description,
            rules: subEventForm.rules || [],
            coordinators: [],
          },
        ],
      });
      setSubEventForm({ name: "", description: "", rules: [] });
    }
  };

  const removeSubEvent = (index: number) => {
    setFormData({
      ...formData,
      subEvents: formData.subEvents.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Event updated successfully!");
        router.push("/dashboard");
      } else {
        alert(data.error || "Failed to update event");
      }
    } catch (error) {
      console.error("Update event error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <main className="min-h-screen p-5 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Edit Event</h1>
          <Link href="/dashboard" className="btn btn-outline">
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Basic Information</h2>

              <fieldset className="fieldset">
                <label className="label">Event Name *</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g., TechFest 2026"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <label className="label">Description *</label>
                <textarea
                  className="textarea w-full h-24"
                  placeholder="Describe your event..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </fieldset>

              <div className="grid md:grid-cols-2 gap-4">
                <fieldset className="fieldset">
                  <label className="label">Event Type *</label>
                  <select
                    className="select w-full"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as any,
                      })
                    }
                    required
                  >
                    <option value="tech-fest">Tech Fest</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="competition">Competition</option>
                  </select>
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label">Venue *</label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Event location"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    required
                  />
                </fieldset>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Dates</h2>

              <div className="grid md:grid-cols-3 gap-4">
                <fieldset className="fieldset">
                  <label className="label">Start Date *</label>
                  <input
                    type="date"
                    className="input w-full"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label">End Date *</label>
                  <input
                    type="date"
                    className="input w-full"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label">Registration Deadline *</label>
                  <input
                    type="date"
                    className="input w-full"
                    value={formData.registrationDeadline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationDeadline: e.target.value,
                      })
                    }
                    required
                  />
                </fieldset>
              </div>
            </div>
          </div>

          {/* Registration Settings */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Registration Settings</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <fieldset className="fieldset">
                  <label className="label">Registration Fee (₹)</label>
                  <input
                    type="number"
                    className="input w-full"
                    min="0"
                    value={
                      formData.registrationFee === 0
                        ? ""
                        : formData.registrationFee
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const normalized = rawValue.replace(/^0+(?=\d)/, "");
                      setFormData({
                        ...formData,
                        registrationFee: normalized
                          ? parseInt(normalized, 10)
                          : 0,
                      });
                    }}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label">UPI ID *</label>
                  <input
                    type="text"
                    className={
                      "input w-full" +
                      (formData.registrationFee! > 0 ? "" : " input-disabled")
                    }
                    placeholder="yourupi@bank"
                    value={formData.upiId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        upiId: e.target.value,
                      })
                    }
                    required={formData.registrationFee! > 0}
                    disabled={formData.registrationFee! <= 0}
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Used to generate the payment QR for registrations.
                  </p>
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label">Max Participants (optional)</label>
                  <input
                    type="number"
                    className="input w-full"
                    min="1"
                    placeholder="Leave empty for unlimited"
                    value={formData.maxParticipants || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxParticipants: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      })
                    }
                  />
                </fieldset>
              </div>

              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={formData.requiresApproval}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requiresApproval: e.target.checked,
                      })
                    }
                  />
                  <span>Require manual approval</span>
                </label>

                <label className="label cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={formData.enableCertificates}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enableCertificates: e.target.checked,
                      })
                    }
                  />
                  <span>Enable certificates</span>
                </label>

                <label className="label cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={formData.enableMealPreferences}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enableMealPreferences: e.target.checked,
                      })
                    }
                  />
                  <span>Meal preferences</span>
                </label>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Contact Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <fieldset className="fieldset">
                  <label className="label">Contact Email *</label>
                  <input
                    type="email"
                    className="input w-full"
                    placeholder="contact@event.com"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <label className="label">Contact Phone *</label>
                  <input
                    type="tel"
                    className="input w-full"
                    placeholder="9876543210"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                    required
                  />
                </fieldset>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Guidelines</h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Add a guideline..."
                  value={guidelineInput}
                  onChange={(e) => setGuidelineInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addGuideline())
                  }
                />
                <button
                  type="button"
                  onClick={addGuideline}
                  className="btn btn-primary"
                >
                  Add
                </button>
              </div>

              {formData.guidelines.length > 0 && (
                <ul className="list-disc list-inside space-y-1 mt-4">
                  {formData.guidelines.map((guideline, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{guideline}</span>
                      <button
                        type="button"
                        onClick={() => removeGuideline(index)}
                        className="btn btn-xs btn-error"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Sub-events */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Sub-events / Competitions</h2>

              <div className="space-y-2">
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Sub-event name (e.g., Coding Competition)"
                  value={subEventForm.name || ""}
                  onChange={(e) =>
                    setSubEventForm({ ...subEventForm, name: e.target.value })
                  }
                />
                <textarea
                  className="textarea w-full"
                  placeholder="Sub-event description..."
                  value={subEventForm.description || ""}
                  onChange={(e) =>
                    setSubEventForm({
                      ...subEventForm,
                      description: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={addSubEvent}
                  className="btn btn-primary btn-sm"
                >
                  Add Sub-event
                </button>
              </div>

              {formData.subEvents.length > 0 && (
                <div className="space-y-2 mt-4">
                  {formData.subEvents.map((subEvent, index) => (
                    <div key={index} className="alert">
                      <div className="flex-1">
                        <h3 className="font-bold">{subEvent.name}</h3>
                        <p className="text-sm">{subEvent.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSubEvent(index)}
                        className="btn btn-xs btn-error"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
            <Link href="/dashboard" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
