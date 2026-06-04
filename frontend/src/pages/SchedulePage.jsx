import { useMemo, useState } from "react";
import { getSchedule } from "../api/scheduleApi";

const SHIPS = ["Albatros", "Perkoz", "Kormoran", "CKT VIP"];

const SchedulePage = () => {
  const [date, setDate] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSchedule = async (selectedDate) => {
    if (!selectedDate) {
      setSchedule([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await getSchedule(selectedDate);
      const data = Array.isArray(res.data) ? res.data : [];
      setSchedule(data);
    } catch (err) {
      console.error("Błąd pobierania harmonogramu:", err);
      setSchedule([]);
      setError("Nie udało się pobrać harmonogramu.");
    } finally {
      setLoading(false);
    }
  };

  const groupedSchedule = useMemo(() => {
    const grouped = {};

    for (const ship of SHIPS) {
      grouped[ship] = [];
    }

    for (const item of schedule) {
      if (!grouped[item.ship]) {
        grouped[item.ship] = [];
      }
      grouped[item.ship].push(item);
    }

    for (const ship of Object.keys(grouped)) {
      grouped[ship].sort((a, b) => a.start.localeCompare(b.start));
    }

    return grouped;
  }, [schedule]);

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    await loadSchedule(selectedDate);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Harmonogram dnia</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Wybierz dzień, aby zobaczyć rejsy przypisane do statków.
        </p>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium">Data</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:w-72"
          />
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-slate-900">
          Ładowanie harmonogramu...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && date && (
        <div className="grid gap-6 lg:grid-cols-2">
          {SHIPS.map((ship) => (
            <section
              key={ship}
              className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">{ship}</h2>
                <span className="rounded-full bg-ocean-100 px-3 py-1 text-xs font-semibold text-ocean-700 dark:bg-ocean-900/30 dark:text-ocean-300">
                  {groupedSchedule[ship]?.length || 0} rejsów
                </span>
              </div>

              {groupedSchedule[ship]?.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">
                  Brak rezerwacji dla tego statku.
                </p>
              ) : (
                <div className="space-y-3">
                  {groupedSchedule[ship].map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold">{item.cruise_name}</div>
                          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {item.start} - {item.end}
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold dark:bg-slate-800">
                          {item.people} osób
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulePage;