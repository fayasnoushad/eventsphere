"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EventData, RegistrationFormData } from "@/lib/types";
import { QRCodeCanvas } from "qrcode.react";

export default function EventRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    year: "",
    selectedSubEvents: [],
  });

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

  const toggleSubEvent = (subEventName: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedSubEvents.includes(subEventName);
      return {
        ...prev,
        selectedSubEvents: isSelected
          ? prev.selectedSubEvents.filter((name) => name !== subEventName)
          : [...prev.selectedSubEvents, subEventName],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event?._id?.toString(),
          data: formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(
          `/events/${params.slug}/success?id=${data.data.ticketId}&name=${formData.name}`,
        );
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
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

  const hasUpiPayment =
    event.registrationFee > 0 && !!event.upiId && event.upiId.trim().length > 0;
  const upiPaymentUrl = hasUpiPayment
    ? `upi://pay?pa=${encodeURIComponent(event.upiId!.trim())}&am=${event.registrationFee}&cu=INR`
    : "";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-5 py-10">
      {submitting ? (
        <>
          <p className="text-xl font-semibold mb-5">
            Processing Registration...
          </p>
          <span className="loading loading-dots loading-xl"></span>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <Link
              href={`/events/${params.slug}`}
              className="btn btn-outline btn-sm mb-4"
            >
              ← Back to Event Details
            </Link>
            <h1 className="text-4xl font-bold">{event.name}</h1>
            <p className="text-lg mt-2">Registration Form</p>
          </div>

          <form
            className="fieldset bg-base-200 border-base-300 rounded-box border p-4 md:px-10 w-full max-w-2xl"
            onSubmit={handleSubmit}
          >
            <h2 className="my-5 text-2xl font-bold text-center">
              Participant Details
            </h2>

            <fieldset className="fieldset">
              <label className="label">Full Name *</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Email *</label>
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
              <label className="label">Phone Number *</label>
              <input
                type="tel"
                className="input w-full"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">College/Institution *</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Your College Name"
                value={formData.college}
                onChange={(e) =>
                  setFormData({ ...formData, college: e.target.value })
                }
                required
              />
            </fieldset>

            <div className="grid md:grid-cols-2 gap-4">
              <fieldset className="fieldset">
                <label className="label">Course *</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g., B.Tech CSE"
                  value={formData.course}
                  onChange={(e) =>
                    setFormData({ ...formData, course: e.target.value })
                  }
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <label className="label">Year/Semester *</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g., 2nd Year"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  required
                />
              </fieldset>
            </div>

            {/* Sub-events Selection */}
            {event.subEvents && event.subEvents.length > 0 && (
              <fieldset className="fieldset">
                <label className="label">
                  Select Competitions/Activities you want to participate in:
                </label>
                <div className="space-y-2 mt-2">
                  {event.subEvents.map((subEvent, index) => (
                    <label
                      key={index}
                      className="flex items-start gap-3 p-3 bg-base-300 rounded cursor-pointer hover:bg-base-100"
                    >
                      <input
                        type="checkbox"
                        className="checkbox mt-1"
                        checked={formData.selectedSubEvents.includes(
                          subEvent.name,
                        )}
                        onChange={() => toggleSubEvent(subEvent.name)}
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{subEvent.name}</div>
                        <div className="text-sm opacity-70">
                          {subEvent.description}
                        </div>
                        {subEvent.registrationFee && (
                          <div className="text-sm">
                            Fee: ₹{subEvent.registrationFee}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Meal Preference */}
            {event.enableMealPreferences && (
              <fieldset className="fieldset">
                <label className="label">Meal Preference</label>
                <div className="flex gap-4">
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="mealPreference"
                      className="radio"
                      value="veg"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mealPreference: e.target.value as any,
                        })
                      }
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="mealPreference"
                      className="radio"
                      value="non-veg"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mealPreference: e.target.value as any,
                        })
                      }
                    />
                    <span>Non-Vegetarian</span>
                  </label>
                </div>
              </fieldset>
            )}

            {/* Fee Display */}
            {event.registrationFee > 0 && (
              <div className="alert alert-info">
                <span>
                  Registration Fee: ₹{event.registrationFee}
                  <br />
                  <small>
                    {hasUpiPayment
                      ? "Scan the UPI QR below to pay the fee."
                      : "Payment details will be provided after registration"}
                  </small>
                </span>
              </div>
            )}

            {hasUpiPayment && (
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body items-center text-center">
                  <h3 className="font-semibold">Pay with UPI</h3>
                  <p className="text-sm opacity-70">
                    Scan to pay ₹{event.registrationFee}
                  </p>
                  <div className="p-3 bg-white rounded-xl shadow">
                    <QRCodeCanvas
                      value={upiPaymentUrl}
                      size={220}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin
                      imageSettings={{
                        src: "/upi-logo.svg",
                        height: 48,
                        width: 48,
                        excavate: true,
                      }}
                    />
                  </div>
                  <div className="mt-3 text-sm">
                    <span className="opacity-70">UPI ID:</span> {event.upiId}
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(upiPaymentUrl);
                      alert("UPI payment link copied!");
                    }}
                  >
                    Copy UPI Link
                  </button>
                </div>
              </div>
            )}

            {event.requiresApproval && (
              <div className="alert alert-warning">
                <span>
                  Your registration will be reviewed and approved by the
                  organizers.
                </span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Complete Registration"}
            </button>
          </form>
        </>
      )}
    </main>
  );
}
