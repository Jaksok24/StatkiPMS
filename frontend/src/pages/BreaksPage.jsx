import { useEffect, useState } from "react";
import BreakForm from "../components/forms/BreakForm";
import { deleteBreak, getBreaks } from "../api/breaksApi";

const BreaksPage = () => {
  const [breaks, setBreaks] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await getBreaks();
      const data = Array.isArray(res.data) ? res.data : [];
      setBreaks(data);
    } catch (err) {
      console.error("Błąd pobierania przerw:", err);
      setBreaks([]);
      setError("Nie udało się pobrać przerw.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBreak(id);
      await load();
    } catch (err) {
      console.error("Błąd usuwania przerwy:", err);
      setError("Nie udało się usunąć przerwy.");
    }
  };

  return (
    <div className="space-y-6">
      <BreakForm onCreated={load} />

      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-bold">Lista przerw</h2>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {breaks.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">Brak przerw.</p>
        ) : (
          <div className="space-y-3">
            {breaks.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-semibold">{item.ship}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {item.date} | {item.start_time} - {item.end_time}
                  </div>
                  {item.note && (
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.note}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-xl border border-red-200 px-4 py-2 text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreaksPage;