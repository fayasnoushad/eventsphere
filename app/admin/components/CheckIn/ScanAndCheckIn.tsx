import Link from "next/link";

export default function ScanAndCheckIn() {
  return (
    <div className="flex flex-row justify-center items-center pt-10 pb-5">
      <Link className="btn btn-soft rounded-xl" href="/admin/scan">
        Scan and check-in
      </Link>
    </div>
  );
}
