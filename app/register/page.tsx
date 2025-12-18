"use client";
import { useEffect, useState } from "react";
import events from "../events";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    year: "",
  });
  const [participatingEvents, setParticipatingEvents] = useState(new Set());
  const [vegStatus, setVegStatus] = useState(false);

  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const savedPassword = localStorage.getItem("password");
    if (savedPassword) setLoginStatus(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (
      data.college.toLowerCase().includes("sadanam") ||
      data.college.toLowerCase().includes("sicoms") ||
      data.college.toLowerCase() === "skc"
    ) {
      setLoading(false);
      return alert(
        "Students from Sadanam Kumaran College or SICOMS can't participate"
      );
    }
    if (
      participatingEvents.has("BGMI") &&
      participatingEvents.has("E-Football")
    ) {
      setLoading(false);
      return alert("BGMI and eFootball are on same time");
    }
    const formData = {
      ...data,
      veg: vegStatus,
      events: [...participatingEvents],
    };
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: formData,
        password: localStorage.getItem("password"),
      }),
    });
    const responseData: any = await response.json();

    if (response.ok)
      window.location.href =
        "/register/success?id=" + responseData.id + "&name=" + data.name;
    else {
      alert(responseData.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh]">
      {loading ? (
        <>
          <p className="text-xl font-semibold mb-5">Generating Ticket</p>
          <span className="loading loading-dots loading-xl"></span>
        </>
      ) : (
        <form
          className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 md:w-[50vh] md:px-10 my-10"
          onSubmit={handleSubmit}
        >
          <h2 className="my-5 text-2xl font-bold text-center">
            Registration Form
          </h2>
          <fieldset className="fieldset">
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input validator w-full"
              placeholder="Name"
              value={data.name}
              onChange={(e) =>
                setData((prevData) => ({ ...prevData, name: e.target.value }))
              }
              required
            />
            <p className="validator-hint hidden">Required</p>
          </fieldset>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              className="input validator w-full"
              placeholder="Email"
              value={data.email}
              onChange={(e) =>
                setData((prevData) => ({ ...prevData, email: e.target.value }))
              }
              required
            />
            <p className="validator-hint hidden">Required</p>
          </fieldset>
          <fieldset className="fieldset">
            <label className="label">Phone number (without +91)</label>
            <input
              type="number"
              className="input validator w-full"
              placeholder="Phone"
              value={data.phone}
              onChange={(e) =>
                setData((prevData) => ({ ...prevData, phone: e.target.value }))
              }
              required
            />
            <p className="validator-hint hidden">Required</p>
          </fieldset>
          <fieldset className="fieldset">
            <label className="label">College Name</label>
            <input
              type="text"
              className="input validator w-full"
              placeholder="College"
              value={data.college}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  college: e.target.value,
                }))
              }
              required
            />
            <p className="validator-hint hidden">Required</p>
          </fieldset>
          <fieldset className="fieldset">
            <label className="label">Course</label>
            <input
              type="text"
              className="input validator w-full"
              placeholder="Course"
              value={data.course}
              onChange={(e) =>
                setData((prevData) => ({ ...prevData, course: e.target.value }))
              }
              required
            />
            <p className="validator-hint hidden">Required</p>
          </fieldset>
          <fieldset className="fieldset">
            <label className="label">Started Year</label>
            <input
              type="number"
              className="input validator w-full"
              placeholder="eg:- 2023"
              value={data.year}
              onChange={(e) =>
                setData((prevData) => ({ ...prevData, year: e.target.value }))
              }
              required
            />
            <p className="validator-hint hidden">Required</p>
          </fieldset>

          <fieldset className="fieldset">
            <label className="label">Food Type</label>
            <div>
              <button
                className={`btn rounded-lg w-1/2 ${
                  vegStatus && "btn-outline btn-success"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setVegStatus((prevStatus) => !prevStatus);
                }}
              >
                Veg {vegStatus && "✅"}
              </button>
              <button
                className={`btn rounded-lg w-1/2 ${
                  !vegStatus && "btn-outline btn-success"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setVegStatus((prevStatus) => !prevStatus);
                }}
              >
                Non-Veg {!vegStatus && "✅"}
              </button>
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <label className="label">Participating Events</label>
            {events.map((event, index) => (
              <button
                className={`btn rounded-lg ${
                  participatingEvents.has(event.name) &&
                  "btn-outline btn-success"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setParticipatingEvents((prevEvents) => {
                    const newEvents = new Set(prevEvents);
                    if (prevEvents.has(event.name))
                      newEvents.delete(event.name);
                    else newEvents.add(event.name);
                    return newEvents;
                  });
                }}
                key={index}
              >
                {event.name} {participatingEvents.has(event.name) && "✅"}
              </button>
            ))}
          </fieldset>

          <button className="btn btn-neutral mt-4" type="submit">
            Register
          </button>
          <button
            className="btn btn-ghost mt-1"
            type="reset"
            onClick={() => (window.location.href = "/register")}
          >
            Reset
          </button>
        </form>
      )}
    </main>
  );
}
