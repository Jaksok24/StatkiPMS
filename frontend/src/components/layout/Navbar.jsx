import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getWebFormsUnreadCount } from "../../api/webFormsApi";

const Dropdown = ({ label, children }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-xl px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
      >
        {label}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-1" onClick={() => setOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const res = await getWebFormsUnreadCount();
        setUnreadCount(res.data?.count || 0);
      } catch (err) {
        console.error("Błąd pobierania licznika wpisów WWW:", err);
        setUnreadCount(0);
      }
    };

    loadUnreadCount();
  }, []);

  const navLinkClass = ({ isActive }) =>
    [
      "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap",
      isActive
        ? "bg-white/20 text-white shadow-md"
        : "text-white/85 hover:bg-white/10 hover:text-white",
    ].join(" ");

  const mobileNavLinkClass = ({ isActive }) =>
    [
      "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap",
      isActive
        ? "bg-white/20 text-white shadow-md"
        : "text-white/85 hover:bg-white/10 hover:text-white",
    ].join(" ");

  const dropdownLinkClass = ({ isActive }) =>
    [
      "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition",
      isActive
        ? "bg-ocean-50 text-ocean-700 dark:bg-ocean-950/30 dark:text-ocean-300"
        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
    ].join(" ");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-ocean-900 via-ocean-700 to-ocean-600 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-inner backdrop-blur">
            ⚓
          </div>

          <div className="min-w-0 leading-tight text-white">
            <div className="truncate text-lg font-bold tracking-wide md:text-xl">
              Statki PSM
            </div>
            <div className="truncate text-xs text-white/70 md:text-sm">
              System do zarządzania rejsami
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Start
          </NavLink>

          <Dropdown label="Operacje">
            <NavLink to="/schedule" className={dropdownLinkClass}>
              <span>Harmonogram</span>
            </NavLink>

            <NavLink to="/reservations" className={dropdownLinkClass}>
              <span>Rezerwacje</span>
            </NavLink>

            <NavLink to="/breaks" className={dropdownLinkClass}>
              <span>Przerwy</span>
            </NavLink>

            <NavLink to="/web-forms" className={dropdownLinkClass}>
              <span>Formularz WWW</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </Dropdown>

          {currentUser?.role === "admin" && (
            <Dropdown label="Zarządzanie">
              <NavLink to="/cruises" className={dropdownLinkClass}>
                <span>Rejsy</span>
              </NavLink>

              <NavLink to="/users" className={dropdownLinkClass}>
                <span>Użytkownicy</span>
              </NavLink>
            </Dropdown>
          )}

          <Dropdown label="Raporty">
            <NavLink to="/history" className={dropdownLinkClass}>
              <span>Historia</span>
            </NavLink>
          </Dropdown>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {currentUser?.username && (
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              {currentUser.username}
            </div>
          )}

          <button
            type="button"
            onClick={() => setDark((prev) => !prev)}
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            {dark ? "☀️ Jasny" : "🌙 Ciemny"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Wyloguj
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 md:hidden">
        <NavLink to="/" className={mobileNavLinkClass}>
          Start
        </NavLink>

        <NavLink to="/schedule" className={mobileNavLinkClass}>
          Harmonogram
        </NavLink>

        <NavLink to="/reservations" className={mobileNavLinkClass}>
          Rezerwacje
        </NavLink>

        <NavLink to="/breaks" className={mobileNavLinkClass}>
          Przerwy
        </NavLink>

        <NavLink to="/web-forms" className={mobileNavLinkClass}>
          {unreadCount > 0 ? `Formularz WWW (${unreadCount})` : "Formularz WWW"}
        </NavLink>

        <NavLink to="/history" className={mobileNavLinkClass}>
          Historia
        </NavLink>

        {currentUser?.role === "admin" && (
          <>
            <NavLink to="/cruises" className={mobileNavLinkClass}>
              Rejsy
            </NavLink>

            <NavLink to="/users" className={mobileNavLinkClass}>
              Użytkownicy
            </NavLink>
          </>
        )}

        <button
          type="button"
          onClick={() => setDark((prev) => !prev)}
          className="rounded-xl px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
        >
          {dark ? "☀️ Jasny" : "🌙 Ciemny"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
        >
          Wyloguj
        </button>
      </div>
    </header>
  );
};

export default Navbar;