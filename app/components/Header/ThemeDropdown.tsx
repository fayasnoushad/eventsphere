import { useTheme } from "next-themes";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

export default function ThemeDropdown() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div title="Change Theme" className="dropdown dropdown-end block px-3">
      {/* Trigger Button */}
      <div
        tabIndex={0}
        role="button"
        className="btn group btn-sm gap-1.5 px-1.5 btn-ghost"
        aria-label="Change Theme"
      >
        <div className="bg-base-100 group-hover:border-base-content/20 border-base-content/10 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1 transition-colors">
          <div className="bg-base-content size-1 rounded-full"></div>
          <div className="bg-primary size-1 rounded-full"></div>
          <div className="bg-secondary size-1 rounded-full"></div>
          <div className="bg-accent size-1 rounded-full"></div>
        </div>

        <svg
          width="12px"
          height="12px"
          className="mt-px hidden size-2 fill-current opacity-60 sm:inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>

      {/* Dropdown List */}
      <div
        tabIndex={0}
        className="dropdown-content bg-base-200 text-base-content rounded-box top-px h-122 max-h-[calc(100vh-8.6rem)] overflow-y-auto border-(length:--border) border-white/5 shadow-2xl outline-(length:--border) outline-black/5 mt-16"
      >
        <ul className="menu w-56">
          <li className="menu-title text-xs">Theme</li>

          {/* Theme items auto-rendered */}
          {themes.map((theme) => (
            <li key={theme} onClick={() => setTheme(theme)}>
              <button
                className="gap-3 px-2"
                data-set-theme={theme}
                data-act-class="[&_svg]:visible"
              >
                <div
                  data-theme={theme}
                  className="bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
                >
                  <div className="bg-base-content size-1 rounded-full"></div>
                  <div className="bg-primary size-1 rounded-full"></div>
                  <div className="bg-secondary size-1 rounded-full"></div>
                  <div className="bg-accent size-1 rounded-full"></div>
                </div>

                <div className="w-32 truncate">{theme}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
