import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-100000 px-4 pt-4 sm:px-8 sm:pt-6">
      <nav
        aria-label="Main"
        className="mx-auto max-w-7xl rounded-[2rem] border border-white/15 bg-primary/60 px-5 py-3 backdrop-blur-md sm:px-8"
      >
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="text-lg font-semibold leading-tight text-white">
            Aral Desert
            <span className="block text-[0.7rem] font-normal tracking-wide text-white/70">
              Trading Est.
            </span>
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `text-[0.95rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isActive ? "text-[#00E599]" : "text-white/90 hover:text-[#00E599]"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden rounded-full border border-white/60 px-6 py-2.5 text-[0.95rem] text-white transition-colors hover:bg-white hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-block"
            >
              Get a Quote
            </Link>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <ul id="mobile-menu" className="mt-4 flex flex-col gap-1 border-t border-white/15 pt-3 lg:hidden">
            {LINKS.map((l) => (
              <li key={l.label}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-2 py-2.5 ${
                      isActive ? "bg-white/10 text-[#00E599]" : "text-white/90 hover:bg-white/10"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-brand-gradient px-6 py-3 text-center font-semibold text-primary"
              >
                Get a Quote
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
