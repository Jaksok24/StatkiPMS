import { useEffect, useState } from "react";
import { getCruises, createCruise, deleteCruise } from "../api/cruisesApi";

const CruisesPage = () => {
  const [cruises, setCruises] = useState([]);
  const [form, setForm] = useState({
    name: "",
    duration: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await getCruises();
      const data = Array.isArray(res.data) ? res.data : [];
      setCruises(data);
    } catch (err) {
      console.error("Błąd pobierania rejsów:", err);
      setCruises([]);
      setError("Nie udało się pobrać rejsów.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      name: form.name.trim(),
      duration: Number(form.duration),
    };

    console.log("FORM STATE:", form);
    console.log("PAYLOAD:", payload);

    if (!payload.name) {
      setError("Podaj nazwę rejsu.");
      return;
    }

    if (!payload.duration || payload.duration <= 0) {
      setError("Czas trwania musi być większy od 0.");
      return;
    }

    try {
      setLoading(true);

      const res = await createCruise(payload);
      console.log("CREATE CRUISE RESPONSE:", res.data);

      setForm({
        name: "",
        duration: "",
      });

      setSuccess("Rejs został dodany.");
      await load();
    } catch (err) {
      console.error("Błąd dodawania rejsu:", err);

      const backendMessage =
        err?.response?.data?.detail ||
        err?.message ||
        "Nie udało się dodać rejsu.";

      setError(String(backendMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");

    try {
      await deleteCruise(id);
      setSuccess("Rejs został usunięty.");
      await load();
    } catch (err) {
      console.error("Błąd usuwania rejsu:", err);
      setError("Nie udało się usunąć rejsu.");
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900"
      >
        <h1 className="mb-4 text-2xl font-bold">Rejsy</h1>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
            {success}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Nazwa rejsu</label>
            <input
              name="name"
              placeholder="Np. Rejs po porcie"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Czas trwania (min)
            </label>
            <input
              name="duration"
              type="number"
              min="1"
              placeholder="Np. 90"
              value={form.duration}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-2xl bg-ocean-600 px-5 py-3 font-semibold text-white transition hover:bg-ocean-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Dodawanie..." : "Dodaj"}
        </button>
      </form>

      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-bold">Lista rejsów</h2>

        {cruises.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">Brak rejsów.</p>
        ) : (
          <div className="space-y-3">
            {cruises.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-semibold">{c.name || "(brak nazwy)"}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {c.duration ?? 0} min
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(c.id)}
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

export default CruisesPage;