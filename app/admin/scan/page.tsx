"use client";
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import Link from "next/link";

export default function ScanQRCode() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function addToCheckIn() {
    const response = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: result,
        password: localStorage.getItem("password"),
      }),
    });
    const jsonData = await response.json();
    if (jsonData.success) alert("Check-in successfully!");
    else alert("Check-in incomplete!");
    setResult("");
  }

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (result === "") return;
    if (audioRef.current) audioRef.current.play().catch(() => {});
    const confirmed = window.confirm(`Confirm check-in for "${result}"?`);
    if (confirmed) addToCheckIn();
  }, [result]);

  return (
    <main className="flex flex-col justify-center items-center gap-10 min-h-[80vh] py-10 px-2">
      <Link className="btn btn-outline" href="/admin">
        Participants List
      </Link>

      {/* Camera preview */}
      <video
        className="w-[90%] md:w-fit md:h-fit rounded-2xl border"
        ref={videoRef}
      />

      {/* Hidden canvas for scanning */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <p className="mt-4 text-lg">
        {result ? `Scanned: ${result}` : "Scanning…"}
      </p>

      <audio ref={audioRef}>
        <source src="/beep.mp3" type="audio/mpeg" />
      </audio>
    </main>
  );
}
