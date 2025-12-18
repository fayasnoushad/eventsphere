import { useState } from "react";

export default function AddToCheckIn() {
  const [id, setId] = useState("");

  const checkin = async () => {
    const response = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "TF-" + id.replace(" ", "").toUpperCase(),
        password: localStorage.getItem("password"),
      }),
    });
    const jsonData = await response.json();
    if (jsonData.success) alert("Check-in successfully!");
    else alert("Check-in incomplete!");
    setId("");
  };

  return (
    <div className="join flex flex-row gap-2 justify-center items-center p-5">
      <label className="input join-item rounded-xl">
        TF-
        <input
          type="text"
          placeholder="PQ0AB"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
      </label>
      <button className="btn btn-soft join-item rounded-xl" onClick={checkin}>
        Add to check-in
      </button>
    </div>
  );
}
