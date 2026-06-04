import { useEffect, useState } from "react";
import {
  getWebForms,
  markWebFormAsRead,
  markWebFormAsUnread,
} from "../api/webFormsApi";

const WebFormsPage = () => {
  const [items, setItems] = useState([]);
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadItems = async (onlyUnread = unreadOnly) => {
    try {
      setLoading(true);
      setError("");

      const res = await getWebForms({ unread_only: onlyUnread });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Błąd pobierania wpisów WWW:", err);
      setItems([]);
      setError("Nie udało się pobrać wpisów.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems(unreadOnly);
  }, [unreadOnly]);

  const handleMarkRead = async (id) => {
    try {
      await markWebFormAsRead(id);
      await loadItems(unreadOnly);
    } catch (err) {
      console.error("Błąd oznaczania jako odczytane:", err);
      setError("Nie udało się oznaczyć wpisu jako odczytany.");
    }
  };

  const handleMarkUnread = async (id) => {
    try {
      await markWebFormAsUnread(id);
      await loadItems(unreadOnly);
    } catch (err) {
      console.error("Błąd oznaczania jako nieodczytane:", err);
      setError("Nie udało się oznaczyć wpisu jako nieodczytany.");
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleDateString("pl-PL");
    } catch {
      return value;
    }
  };

  const formatTime = (value) => {
    if (!value) return "-";

    try {
      return String(value).slice(0, 5);
    } catch {
      return value;
    }
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Formularz WWW</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Wpisy klientów dodane przez formularz na stronie internetowej.
            </p>
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
            />
            Tylko nieodczytane
          </label>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        {loading && (
          <p className="text-slate-500 dark:text-slate-400">Ładowanie...</p>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {!loading && items.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            Brak wpisów do wyświetlenia.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 ${
                  item.odczytano
                    ? "border-slate-200 dark:border-slate-800"
                    : "border-ocean-300 bg-ocean-50 dark:border-ocean-700 dark:bg-ocean-950/20"
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="font-semibold">
                      {item.imie_nazwisko || "Brak imienia i nazwiska"}
                    </div>

                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Termin rejsu: {formatDate(item.dzien)} | {formatTime(item.godzina)} | {item.rejs || "-"}
                    </div>

                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Dodano: {formatDateTime(item.created_at)}
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Email: {item.email || "-"} | Tel: {item.nr_tel || "-"}
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Liczba osób: {item.liczba_ludzi ?? "-"} | Catering: {item.catering || "-"}
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Miejsce cateringu: {item.miejsce_catering || "-"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {item.odczytano ? (
                      <button
                        onClick={() => handleMarkUnread(item.id)}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
                      >
                        Oznacz jako nieodczytane
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkRead(item.id)}
                        className="rounded-xl bg-ocean-600 px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-700"
                      >
                        Oznacz jako odczytane
                      </button>
                    )}

                    <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-slate-800">
                      {item.odczytano ? "Odczytane" : "Nowe"}
                    </div>
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

export default WebFormsPage;