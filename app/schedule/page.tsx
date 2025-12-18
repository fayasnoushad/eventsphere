export default function TimeSchedule() {
  const schedule = [
    { time: "09:00 AM", title: "STARTING" },
    { time: "10:00 AM", title: "SPEED TYPING" },
    { time: "10:00 AM", title: "PHOTOGRAPHY" },
    { time: "10:00 AM", title: "DEBUGGING", level: "LEVEL 1" },
    { time: "10:15 AM", title: "CODING", level: "LEVEL 1" },
    { time: "11:00 AM", title: "DEBUGGING", level: "LEVEL 2" },
    { time: "11:30 AM", title: "CODING", level: "LEVEL 2" },
    { time: "11:00 AM", title: "BGMI" },
    { time: "11:00 AM", title: "E-FOOTBALL" },
    { time: "11:30 AM", title: "MEMORY TEST" },
    { time: "12:30 PM", title: "FOOD: LUNCH" },
    { time: "02:00 PM", title: "TREASURE HUNT" },
    { time: "04:30 PM", title: "PRIZE FOR WINNERS" },
  ];

  return (
    <main className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10">Event Schedule</h1>

      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical w-full max-w-3xl">
        {schedule.map((item, index) => (
          <li key={index}>
            {index !== 0 && <hr />}

            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div
              className={`${
                index % 2 === 0 ? "timeline-start md:text-end" : "timeline-end"
              } mb-10`}
            >
              <time className="font-mono italic">{item.time}</time>
              <div className="text-lg font-bold">{item.title}</div>
              {item.level && <p className="opacity-70">{item.level}</p>}
            </div>

            <hr />
          </li>
        ))}
      </ul>
    </main>
  );
}
