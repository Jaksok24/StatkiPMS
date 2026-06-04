import { useEffect, useState } from "react";
import { getHistory } from "../api/historyApi";
import { getShips } from "../api/shipsApi";

const initialFilters = {
  date_from: "",
  date_to: "",
  ship: "",
  type: "all",
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [ships, setShips] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadShips = async () => {
    try {
      const res = await getShips();
      setShips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Błąd pobierania statków:", err);
      setShips([]);
    }
  };

  const loadHistory = async (activeFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const res = await getHistory(activeFilters);
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Błąd pobierania historii:", err);
      setHistory([]);
      setError(err?.response?.data?.detail || "Nie udało się pobrać historii.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShips();
    loadHistory(initialFilters);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    await loadHistory(filters);
  };

  const handleReset = async () => {
    setFilters(initialFilters);
    await loadHistory(initialFilters);
  };

  const formatDateTime = (value) => {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleString("pl-PL");
    } catch {
      return value;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Historia</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Podgląd wszystkich rezerwacji i przerw z możliwością filtrowania.
        </p>
      </div>

      <form
        onSubmit={handleFilterSubmit}
        className="grid gap-4 rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900 md:grid-cols-2 xl:grid-cols-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">Data od</label>
          <input
            type="date"
            name="date_from"
            value={filters.date_from}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Data do</label>
          <input
            type="date"
            name="date_to"
            value={filters.date_to}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Statek</label>
          <select
            name="ship"
            value={filters.ship}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Wszystkie</option>
            {ships.map((ship) => (
              <option key={ship} value={ship}>
                {ship}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Typ</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="all">Wszystko</option>
            <option value="reservation">Rezerwacje</option>
            <option value="break">Przerwy</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-2xl bg-ocean-600 px-5 py-3 font-semibold text-white transition hover:bg-ocean-700"
          >
            Filtruj
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold dark:border-slate-700"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Wyniki</h2>
          {loading && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Ładowanie...
            </span>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {!loading && history.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            Brak wpisów dla wybranych filtrów.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className={`rounded-2xl border p-4 ${
                  item.type === "break"
                    ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="font-semibold">
                      {item.type === "break" ? "Przerwa" : item.title}
                    </div>

                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {item.date}
                      {item.time_start ? ` | ${item.time_start}` : ""}
                      {item.time_end ? ` - ${item.time_end}` : ""}
                      {item.ship ? ` | ${item.ship}` : ""}
                    </div>

                    {item.type === "reservation" && (
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Klient: {item.customer || "-"} | Osób: {item.people ?? "-"} | Opłata:{" "}
                        {item.fee ?? "-"} zł
                      </div>
                    )}

                    {item.created_by && (
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Dodał: {item.created_by}
                      </div>
                    )}

                    {item.created_at && (
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Dodano: {formatDateTime(item.created_at)}
                      </div>
                    )}

                    {item.note && (
                      <div className="mt-2 text-sm italic text-slate-600 dark:text-slate-300">
                        {item.note}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase dark:bg-slate-800">
                    {item.type === "break" ? "Przerwa" : "Rezerwacja"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;