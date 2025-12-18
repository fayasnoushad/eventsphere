import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content min-h-[10vh] p-4">
      <aside>
        <Link
          href="https://www.gnu.org/licenses/gpl-3.0.en.html"
          target="_blank"
        >
          Copyright &copy; {new Date().getFullYear()} - Fest Management Website
          <br />
          GNU Affero General Public License v3 (GNU AGPL v3)
        </Link>
      </aside>
    </footer>
  );
}
