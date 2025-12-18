import { QRCodeSVG } from "qrcode.react";
import { RefObject, useRef } from "react";

export default function Ticket({
  id,
  name,
  ticketRef,
}: {
  id: string;
  name: string;
  ticketRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col items-center py-6">
      <div ref={ticketRef} className="p-8 bg-base-100">
        <div className="bg-linear-to-tr from-white to-gray-500 text-black rounded-2xl p-6 flex flex-col gap-6">
          <h1 className="text-lg font-semibold">TE-X-US: The future forge</h1>

          <div className="rounded-xl p-4 flex flex-col items-center">
            <h3 className="bg-black text-white px-3 py-1 rounded-lg mb-3 text-sm">
              The Invitation.
            </h3>
            <div className="bg-white p-2 rounded-xl">
              <QRCodeSVG value={id} size={110} />
            </div>
          </div>

          <div className="flex flex-col justify-between w-full">
            <div>
              <p className="text-sm opacity-90 mt-4">Delegate Name</p>
              <p className="text-lg font-semibold">
                {name.trim().toUpperCase()}
              </p>

              <p className="text-sm opacity-90 mt-3">Invite Code:</p>
              <p className="text-md font-semibold">{id}</p>
            </div>

            <div className="text-xs opacity-90 mt-4">
              Tuesday, 16 December
              <br />
              09:00AM - 05:00PM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
