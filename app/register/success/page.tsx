"use client";
import Link from "next/link";
import html2canvas from "html2canvas-pro";
import Ticket from "./components/Ticket";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";

function Success() {
  const ticketRef = useRef<HTMLDivElement | null>(null);
  const params = useSearchParams();
  const id = params.get("id") || "";
  const name = params.get("name") || "";
  const [saveStatus, setSaveStatus] = useState(false);

  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current);
    const link = document.createElement("a");
    link.download = "ticket.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <main className="flex flex-col items-center min-h-[80vh]">
      <h2 className="text-2xl font-bold mt-10">Registered Successfully!</h2>
      {id !== "" && (
        <>
          <Ticket id={id} name={name} ticketRef={ticketRef} />
          <div className="flex flex-row gap-2 pb-10">
            <button
              className={`btn rounded-full ${
                saveStatus ? "btn-success" : "btn-primary"
              }`}
              onClick={() => {
                downloadTicket();
                setSaveStatus(true);
              }}
            >
              {saveStatus ? "Saved" : "Save this ticket"}
            </button>
            <Link
              className="btn btn-soft btn-success rounded-full"
              href="https://chat.whatsapp.com/"
              target="_blank"
            >
              Join on WhatsApp
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

export default function page() {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
}
