import { useState } from "react";
import { ParticipantType } from "./Participants";

export default function Participant({
  participant,
  pending = false,
  eventParticipants = false,
}: {
  participant: ParticipantType;
  pending?: boolean;
  eventParticipants?: boolean;
}) {
  const [checkinStatus, setcheckinStatus] = useState(participant.checkin);
  const [showEvents, setShowEvents] = useState(false);

  const togglecheckinStatus = async () => {
    const confirmation = confirm(
      `Are you sure that ${participant.id} want to check-${
        checkinStatus ? "out" : "in"
      }`
    );
    if (!confirmation) return;
    const response = await fetch("/api/checkin", {
      method: checkinStatus ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: participant.id,
        password: localStorage.getItem("password"),
      }),
    });
    const jsonData = await response.json();
    if (jsonData.success) setcheckinStatus((prevStatus) => !prevStatus);
  };

  const approve = async () => {
    const confirmation = confirm("Are you sure that you want to approve?");
    if (!confirmation) return alert("Not confirmed");
    await fetch("/api/approve", {
      method: checkinStatus ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: participant.phone,
        password: localStorage.getItem("password"),
      }),
    });
    alert("Approved");
    window.location.reload();
  };

  return (
    <>
      <tr>
        <th>{participant.id}</th>
        <td>{participant.name}</td>
        <td>{participant.phone}</td>
        <td>{participant.college}</td>
        <td>{participant.course}</td>
        <td>{participant.year}</td>
        <td>{participant.email}</td>
        <td>
          <button
            className="btn"
            onClick={() => setShowEvents((prevStatus) => !prevStatus)}
          >
            {showEvents ? "Hide" : "Show"} Events
          </button>
        </td>
        {!eventParticipants &&
          (pending ? (
            <td>
              <button className="btn btn-soft btn-info" onClick={approve}>
                Approve
              </button>
            </td>
          ) : (
            <td>
              <button
                className={`btn btn-soft btn-${
                  checkinStatus ? "warning" : "info"
                }`}
                onClick={() => togglecheckinStatus()}
              >
                {checkinStatus ? "Remove from check-in" : "Add to check-in"}
              </button>
            </td>
          ))}
      </tr>
      {showEvents && (
        <tr>
          <td colSpan={9}>
            <b>Events</b>: {participant.events.join(", ")}
          </td>
        </tr>
      )}
    </>
  );
}
