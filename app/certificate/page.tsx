"use client";
import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { ParticipantType } from "../admin/components/Participants/Participants";

export default function Certificate() {
  const certificateRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState("");
  const [data, setData] = useState<ParticipantType | null>(null);
  const [byTicket, setByTicket] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState(false);

  const getCertificate = async () => {
    const response = await fetch("/api/participant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(byTicket ? { id: value } : { phone: value }),
    });
    const jsonData = await response.json();
    console.log(jsonData);
    if (jsonData.success) setData(jsonData.participant);
    else alert("Certificate not found!");
    setValue("");
  };

  const download = async () => {
    if (!certificateRef.current) return;
    const canvas = await html2canvas(certificateRef.current, { scale: 5 });
    const link = document.createElement("a");
    link.download = "certificate.png";
    link.href = canvas.toDataURL();
    link.click();
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
      <div className="join flex flex-col md:flex-row gap-2 justify-center items-center p-5 pt-10">
        <select
          className="select rounded-xl"
          value={byTicket ? "ticket" : "phone"}
          onChange={(e) => setByTicket(e.target.value === "ticket")}
        >
          <option value="ticket">Ticket</option>
          <option value="phone">Phone</option>
        </select>
        {byTicket ? (
          <label className="input join-item rounded-xl">
            TF-
            <input
              type="text"
              placeholder="PQ0AB"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </label>
        ) : (
          <label className="input join-item rounded-xl">
            +91
            <input
              type="number"
              placeholder="9876543210"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </label>
        )}
        <button
          className="btn btn-soft join-item rounded-xl"
          onClick={getCertificate}
        >
          Get Certificate
        </button>
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
                    <img
                      src="/skc.png"
                      alt="Logo"
                      className="w-28 absolute top-10 right-12 p-2"
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
                      <b>TE‑X‑US: The Future Forge</b>, an inter‑college tech
                      fest organized by the{" "}
                      <b>Department of Computer Science</b>,{" "}
                      <b>Sadanam Kumaran College, Pathiripala</b>, in
                      association with the <b>Coding Club</b>, held on 16
                      December 2025.
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
              className={`btn rounded-full ${
                downloadStatus ? "btn-success" : "btn-primary"
              }`}
              onClick={() => {
                download();
                setDownloadStatus(true);
              }}
            >
              {downloadStatus
                ? "Downloaded Successfully"
                : "Download Certificate"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
