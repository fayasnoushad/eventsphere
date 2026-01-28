"use client";
import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { ParticipantType } from "../admin/components/Participants/Participants";

interface EventData {
  name: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  type: string;
}

export default function Certificate() {
  const certificateRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState("");
  const [eventId, setEventId] = useState("");
  const [data, setData] = useState<ParticipantType | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [downloadStatus, setDownloadStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCertificate = async () => {
    if (!eventId || !value) {
      alert("Please enter both Event ID and search value!");
      return;
    }

    setLoading(true);
    try {
      // Fetch participant data
      const response = await fetch("/api/participant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          ticketId: value.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to fetch participant data");
        setLoading(false);
        return;
      }

      const jsonData = await response.json();

      if (!jsonData.success) {
        alert(jsonData.error || "Participant not found!");
        setLoading(false);
        return;
      }

      const participant = jsonData.data.participant;

      // Check if participant is eligible for certificate (must be checked-in)
      if (participant.status !== "checked-in") {
        alert("Certificate only available for checked-in participants!");
        setLoading(false);
        return;
      }

      setData(participant);

      // Fetch event data
      const eventResponse = await fetch(`/api/events/${eventId}`);
      const eventJsonData = await eventResponse.json();

      if (eventJsonData.success && eventJsonData.data?.event) {
        setEventData(eventJsonData.data.event);
      }

      setValue("");
    } catch (error) {
      console.error("Get certificate error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    if (!certificateRef.current || !data) return;

    try {
      setDownloadStatus(false);
      const canvas = await html2canvas(certificateRef.current, {
        scale: 5,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      const fileName = `certificate-${data.name.replace(/\s+/g, "-")}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      setDownloadStatus(true);

      // Reset status after 3 seconds
      setTimeout(() => setDownloadStatus(false), 3000);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download certificate. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "tech-fest": "Tech Fest",
      hackathon: "Hackathon",
      workshop: "Workshop",
      seminar: "Seminar",
      competition: "Competition",
    };
    return labels[type] || "Event";
  };

  const sign1 = {
    label: "Prof. Person One",
    role: "HEAD OF THE DEPARTMENT",
    img: "sign.png",
  };
  const sign2 = {
    label: "Prof. Person Two",
    role: "DIRECTOR",
    img: "sign.png",
  };
  const sign3 = {
    label: "Prof. Person 3",
    role: "PRINCIPAL",
    img: "sign.png",
  };

  return (
    <main className="min-h-[80vh]">
      <div className="flex flex-col gap-4 justify-center items-center p-5 pt-10">
        <h1 className="text-3xl font-bold">Download Certificate</h1>

        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            className="input rounded-xl"
            placeholder="Enter Event ID"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            required
          />

          <input
            type="text"
            className="input rounded-xl"
            placeholder="e.g., TF-PQ0AB"
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            required
          />

          <button
            className="btn btn-primary rounded-xl min-w-[150px]"
            onClick={getCertificate}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Get Certificate"
            )}
          </button>
        </div>

        <p className="text-sm opacity-70 text-center max-w-md">
          Enter your Event ID and Ticket ID to download your certificate.
          Certificates are only available for checked-in participants.
        </p>
      </div>
      {data && (
        <>
          <div className="w-full overflow-x-auto lg:flex lg:flex-row lg:justify-center lg:items-center">
            <div className="min-w-5xl m-auto">
              <div className="w-full p-10 text-black delius-regular">
                <div
                  ref={certificateRef}
                  className="relative bg-white p-10 w-full max-w-4xl shadow-xl overflow-hidden"
                >
                  {/* Outer decorative border */}
                  <div className="absolute inset-0 border-22 border-[#0E2A36] pointer-events-none" />

                  {/* Golden corner strokes */}
                  <div className="absolute top-10 left-10 w-40 border-t-4 border-[#C08A2E]" />
                  <div className="absolute top-10 left-10 h-32 border-l-4 border-[#C08A2E]" />

                  <div className="absolute top-10 right-10 w-40 border-t-4 border-[#C08A2E]" />
                  <div className="absolute top-10 right-10 h-32 border-r-4 border-[#C08A2E]" />

                  <div className="absolute bottom-10 left-10 w-40 border-b-4 border-[#C08A2E]" />
                  <div className="absolute bottom-10 left-10 h-32 border-l-4 border-[#C08A2E]" />

                  <div className="absolute bottom-10 right-10 w-40 border-b-4 border-[#C08A2E]" />
                  <div className="absolute bottom-10 right-10 h-32 border-r-4 border-[#C08A2E]" />

                  {/* Logo */}
                  <div className="flex">
                    <img
                      src="/favico.ico"
                      alt="Logo"
                      className="w-28 absolute top-10 left-12 p-2"
                    />
                  </div>

                  {/* Certificate Main Text */}
                  <div className="text-center mt-10 px-8">
                    <h1 className="text-4xl font-bold tracking-wide">
                      CERTIFICATE
                    </h1>
                    <h2 className="text-xl mt-1">of Participation</h2>
                    {/* Name */}
                    <h2 className="text-5xl font-serif italic mt-8 eagle-lake-regular">
                      {data.name}
                    </h2>
                    <h3 className="text-xl mt-2">
                      <b>From:</b>
                      <span className="font-serif italic mt-8 eagle-lake-regular">
                        {data.college}
                      </span>
                    </h3>
                    {/* Description */}
                    <p className="mt-4 text-lg leading-relaxed max-w-3xl mx-auto">
                      has successfully participated in{" "}
                      <b>{eventData?.name || "Event"}</b>
                      {eventData?.type && (
                        <>, a {getEventTypeLabel(eventData.type)}</>
                      )}
                      {eventData?.venue && (
                        <>
                          , held at <b>{eventData.venue}</b>
                        </>
                      )}
                      {eventData?.startDate && (
                        <>
                          , on{" "}
                          <b>
                            {formatDate(eventData.startDate)}
                            {eventData?.endDate &&
                              eventData.startDate !== eventData.endDate &&
                              ` - ${formatDate(eventData.endDate)}`}
                          </b>
                        </>
                      )}
                      .
                      {eventData?.description && (
                        <span className="block mt-2 text-base">
                          {eventData.description}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-3 text-center px-8 pb-3">
                    {[sign1, sign2, sign3].map((s, i) => (
                      <div key={i}>
                        <div className="px-20 pt-2">
                          <img src={"/signature/" + s.img} />
                        </div>
                        <p className="font-semibold">{s.label}</p>
                        <p className="text-sm">{s.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-center gap-2 pb-10">
            <button
              className="btn btn-outline rounded-full"
              onClick={() => {
                setData(null);
                setEventData(null);
                setDownloadStatus(false);
              }}
            >
              Get Another Certificate
            </button>
            <button
              className={`btn rounded-full ${
                downloadStatus ? "btn-success" : "btn-primary"
              }`}
              onClick={download}
              disabled={downloadStatus}
            >
              {downloadStatus ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Downloaded Successfully
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download Certificate
                </>
              )}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
