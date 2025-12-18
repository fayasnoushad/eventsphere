import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import AddToCheckIn from "../CheckIn/AddToCheckIn";
import ScanAndCheckIn from "../CheckIn/ScanAndCheckIn";
import events from "@/app/events";

export type ParticipantType = {
  id: string;
  name: string;
  email: string;
  phone: number;
  college: string;
  course: string;
  year: string;
  events: string[];
  checkin: boolean;
};

export default function Participants() {
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [pendingParticipants, setPendingParticipants] = useState<
    ParticipantType[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: localStorage.getItem("password") }),
      });
      const jsonData = await response.json();
      setParticipants(jsonData.participants);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: localStorage.getItem("password") }),
      });
      const jsonData = await response.json();
      setPendingParticipants(jsonData.participants);
    };
    fetchData();
  }, []);

  return (
    <>
      <ScanAndCheckIn />
      <AddToCheckIn />
      <h2 className="mt-15 text-xl font-bold text-center">
        Participants - {participants.length}
      </h2>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mx-5 my-10">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>College</th>
              <th>Course</th>
              <th>Year</th>
              <th>Email</th>
              <th>Events</th>
              <th>Check-in</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <Participant key={index} participant={participant} />
            ))}
          </tbody>
        </table>
      </div>
      {pendingParticipants.length > 0 && (
        <>
          <h2 className="mt-15 text-xl font-bold text-center">
            Pending Participants - {pendingParticipants.length}
          </h2>
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mx-5 my-10">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>College</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Email</th>
                  <th>Events</th>
                  <th>Approve</th>
                </tr>
              </thead>
              <tbody>
                {pendingParticipants.map((participant, index) => (
                  <Participant
                    key={index}
                    participant={participant}
                    pending={true}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {events.map((event, index) => {
        const eventParticipants = participants.filter((participant) =>
          participant.events.includes(event.name)
        );
        return (
          <React.Fragment key={index}>
            <h2 className="mt-15 text-xl font-bold text-center">
              {event.name}: Participants - {eventParticipants.length}
            </h2>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mx-5 my-10">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>College</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Email</th>
                    <th>Events</th>
                  </tr>
                </thead>
                <tbody>
                  {eventParticipants.map((participant, index) => (
                    <Participant
                      key={index}
                      participant={participant}
                      eventParticipants={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}
