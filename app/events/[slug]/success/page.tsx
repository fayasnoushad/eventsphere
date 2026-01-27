"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const participantId = searchParams.get("id");
  const name = searchParams.get("name");
  const slug = params.slug;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (participantId) {
      navigator.clipboard.writeText(participantId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `ticket-${participantId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (!participantId || !name) {
    return (
      <div className="text-center py-20">
        <p className="text-xl">Invalid registration data</p>
        <Link href="/" className="btn btn-primary mt-4">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-5 py-10">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold">Registration Successful!</h1>
        <p className="text-xl mt-4">Welcome, {name}!</p>
      </div>

      <div className="card bg-base-200 shadow-2xl w-full max-w-md">
        <div className="card-body items-center text-center">
          <h2 className="card-title mb-4">Your Event Ticket</h2>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-lg mb-4">
            <QRCodeSVG
              id="qr-code"
              value={participantId}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Participant ID */}
          <div className="w-full">
            <label className="label">
              <span className="label-text">Your Participant ID</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered w-full text-center font-mono text-lg"
                value={participantId}
                readOnly
              />
              <button
                onClick={handleCopy}
                className="btn btn-square"
                title="Copy ID"
              >
                {copied ? "✓" : "📋"}
              </button>
            </div>
          </div>

          <div className="alert alert-info mt-4">
            <span className="text-sm">
              Save this QR code! You&apos;ll need it for check-in at the event.
            </span>
          </div>

          <div className="card-actions w-full mt-6 flex-col gap-2">
            <button onClick={handleDownload} className="btn btn-primary w-full">
              📥 Download QR Code
            </button>
            <Link href={`/events/${slug}`} className="btn btn-outline w-full">
              Back to Event
            </Link>
            <Link href="/" className="btn btn-outline w-full">
              Browse More Events
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center max-w-md">
        <h3 className="font-semibold mb-2">What&apos;s Next?</h3>
        <ul className="text-sm space-y-2 text-left">
          <li>✓ Check your email for confirmation details</li>
          <li>✓ Save or screenshot your QR code</li>
          <li>✓ Present this QR code at the event for check-in</li>
          <li>✓ Follow event updates from the organizers</li>
        </ul>
      </div>
    </main>
  );
}

export default function EventSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-dots loading-xl"></span>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
