import Link from "next/link";
import Events from "./components/Events/Events";
import Guidelines from "./components/Guidelines/Guidelines";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center text-center h-full mx-5">
      <span className="text-3xl font-bold mt-[10vh]">TE-X-US</span>
      <p className="text-lg mt-5">The future forge</p>
      <h3 className="text-lg font-semibold mt-3">Inter-college Tech Fest</h3>
      <div className="flex flex-row flex-wrap justify-center mt-5 gap-5 font-bold mx-5">
        <Link
          className="btn btn-outline rounded font-bold text-lg"
          href="/register/"
        >
          REGISTER NOW &#8594;
        </Link>
        <Link
          className="btn btn-outline rounded font-bold text-lg"
          href="/schedule/"
        >
          TIME SCHEDULE
        </Link>
        {/* <Link
          className="btn btn-outline rounded font-bold text-lg"
          href="/certificate/"
        >
          Download Certificate
        </Link> */}
      </div>
      <Guidelines />
      <Events />
    </main>
  );
}
