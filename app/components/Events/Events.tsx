import events from "@/app/events";

export default function Events() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-15 my-20 m-10 w-[90%]">
      {events.map((event, index) => (
        <div
          className="card bg-base-200 shadow-xl hover:shadow-2xl md:w-96"
          key={index}
        >
          <figure>
            <img
              className="rounded-xl"
              src={"/" + event.image}
              alt={event.name}
            />
          </figure>
          <div className="card-body px-2">
            <h2 className="card-title mx-auto">{event.name}</h2>
            <div className="card-body text-start ms-5">
              <p className="mb-3">{event.description}</p>
              <h3 className="font-semibold underline">Rules:</h3>
              <ul className="list list-disc list-inside">
                {event.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
              {event.studentCoordinators.length > 0 && (
                <>
                  <h3 className="font-semibold underline">
                    Student Coordinators:
                  </h3>
                  <div>
                    {event.studentCoordinators.map((coordinator, index) => (
                      <p key={index}>
                        {coordinator[0]}: {coordinator[1]}
                      </p>
                    ))}
                  </div>
                </>
              )}
              {event.facultyCoordinators.length > 0 && (
                <>
                  <h3 className="font-semibold underline">
                    Faculty Coordinators:
                  </h3>
                  <div>
                    {event.facultyCoordinators.map((coordinator, index) => (
                      <p key={index}>
                        {coordinator[0]}: {coordinator[1]}
                      </p>
                    ))}
                  </div>
                </>
              )}
              <h3 className="font-semibold underline">Prize:</h3>
              <ul className="list list-disc list-inside">
                {event.prize.first !== 0 && (
                  <li>First: {event.prize.first}₹</li>
                )}
                {event.prize.second !== 0 && (
                  <li>Second: {event.prize.second}₹</li>
                )}
                {event.prize.third !== 0 && (
                  <li>Third: {event.prize.third}₹</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
