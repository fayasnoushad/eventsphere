"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import jsQR from "jsqr";
import Link from "next/link";

export default function ScanQRCode() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState("");
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();

        if (response.ok && data.data?.event) {
          setEventName(data.data.event.name);
        } else {
          alert("Event not found");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Fetch event error:", error);
        alert("Failed to load event");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, router]);

  async function addToCheckIn(participantId: string) {
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId,
          eventId,
        }),
      });

      const jsonData = await response.json();

      if (jsonData.success) {
        alert("Check-in successful!");
      } else {
        alert(jsonData.error || "Check-in failed!");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      alert("An error occurred during check-in");
    }

    setResult("");
  }

  useEffect(() => {
    if (loading) return;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.muted = true;
        await videoRef.current.play();
        scanLoop();
      } catch (err) {
        console.error("Camera error:", err);
        alert("Unable to access camera. Please check permissions.");
      }
    }

    function scanLoop() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const loop = () => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure video is ready and has valid dimensions
        if (
          video.readyState < 2 || // HAVE_CURRENT_DATA
          video.videoWidth <= 0 ||
          video.videoHeight <= 0
        ) {
          requestAnimationFrame(loop);
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        let imageData: ImageData | null = null;
        try {
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch {
          // Skip this frame if getImageData fails due to invalid size
          requestAnimationFrame(loop);
          return;
        }

        if (!imageData || imageData.data.length === 0) {
          requestAnimationFrame(loop);
          return;
        }

        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
        if (qrCode) setResult(qrCode.data);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    startCamera();

    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [loading]);

  useEffect(() => {
    if (result === "") return;
    if (audioRef.current) audioRef.current.play().catch(() => {});

    const confirmed = window.confirm(
      `Confirm check-in for participant "${result}"?`,
    );
    if (confirmed) {
      addToCheckIn(result);
    } else {
      setResult("");
    }
  }, [result]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </main>
    );
  }

  return (
    <main className="flex flex-col justify-center items-center gap-6 min-h-screen py-10 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">QR Code Scanner</h1>
        <p className="text-lg opacity-70">{eventName}</p>
      </div>

      <div className="flex gap-4">
        <Link
          className="btn btn-outline"
          href={`/dashboard/events/${eventId}/participants`}
        >
          View Participants
        </Link>
        <Link className="btn btn-outline" href="/dashboard">
          Back to Dashboard
        </Link>
      </div>

      {/* Camera preview */}
      <div className="w-full max-w-2xl">
        <video
          className="w-full rounded-2xl border-4 border-primary shadow-lg"
          ref={videoRef}
        />
      </div>

      {/* Hidden canvas for scanning */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="text-center">
        <p className="text-xl font-semibold">
          {result ? (
            <span className="text-success">Scanned: {result}</span>
          ) : (
            <span className="text-info">Ready to scan...</span>
          )}
        </p>
        <p className="text-sm opacity-60 mt-2">
          Point camera at participant's QR code ticket
        </p>
      </div>

      <audio ref={audioRef}>
        <source src="/beep.mp3" type="audio/mpeg" />
      </audio>
    </main>
  );
}
