import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummary } from "../api/dashboardApi";
import { getWebFormsUnreadCount } from "../api/webFormsApi";

const today = new Date().toISOString().split("T")[0];

const HomePage = () => {
  const [summary, setSummary] = useState({
    reservations_today: 0,
    breaks_today: 0,
    unread_web_forms: 0,
    schedule_items_today: 0,
  });

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await getDashboardSummary();
        setSummary(res.data);
      } catch (err) {
        console.error("Błąd pobierania dashboardu:", err);
      }
    };

    const loadUnreadCount = async () => {
      try {
        const res = await getWebFormsUnreadCount();
        setUnreadCount(res.data?.count || 0);
      } catch (err) {
        console.error("Błąd pobierania licznika nieodczytanych:", err);
        setUnreadCount(0);
      }
    };

    loadSummary();
    loadUnreadCount();
  }, []);

  const tiles = [
    {
      title: "Rejsy",
      description: "Dodawanie, edycja i usuwanie dostępnych rejsów.",
      to: "/cruises",
      icon: "🚢",
    },
    {
      title: "Rezerwacje",
      description: "Tworzenie i przegląd rezerwacji klientów.",
      to: "/reservations",
      icon: "📝",
    },
    {
      title: "Przerwy",
      description: "Dodawanie i przegląd przerw dla statków.",
      to: "/breaks",
      icon: "☕",
    },
    {
      title: "Harmonogram dzisiaj",
      description: "Szybki podgląd harmonogramu na bieżący dzień.",
      to: `/schedule?date=${today}`,
      icon: "📅",
    },
    {
      title: "Historia",
      description: "Rezerwacje i przerwy z filtrowaniem.",
      to: "/history",
      icon: "📜",
    },
    {
      title: "Formularz WWW",
      description: "Nowe wpisy klientów z formularza internetowego.",
      to: "/web-forms",
      icon: "🌐",
      badge: unreadCount,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Strona główna
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Wybierz moduł, w którym chcesz pracować.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Rezerwacje dziś
          </div>
          <div className="mt-2 text-3xl font-bold">
            {summary.reservations_today}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Przerwy dziś
          </div>
          <div className="mt-2 text-3xl font-bold">
            {summary.breaks_today}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Nieodczytane wpisy WWW
          </div>
          <div className="mt-2 text-3xl font-bold">
            {summary.unread_web_forms}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Pozycje w harmonogramie dziś
          </div>
          <div className="mt-2 text-3xl font-bold">
            {summary.schedule_items_today}
          </div>
        </div>
      </section>

      {unreadCount > 0 && (
        <div className="rounded-2xl border border-ocean-300 bg-ocean-50 px-5 py-4 text-ocean-800 dark:border-ocean-700 dark:bg-ocean-950/20 dark:text-ocean-200">
          Masz <span className="font-bold">{unreadCount}</span> nieodczytanych
          wpisów z formularza WWW.
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => (
          <Link
            key={tile.title}
            to={tile.to}
            className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-ocean-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-ocean-700"
          >
            {tile.badge > 0 && (
              <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                {tile.badge}
              </div>
            )}

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean-100 text-2xl dark:bg-ocean-900/30">
              {tile.icon}
            </div>

            <h2 className="text-xl font-bold">{tile.title}</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {tile.description}
            </p>

            <div className="mt-5 text-sm font-semibold text-ocean-700 dark:text-ocean-300">
              Otwórz →
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default HomePage;